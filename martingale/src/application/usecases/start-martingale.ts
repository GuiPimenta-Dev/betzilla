import { MakeMartingaleBet } from "../../domain/commands/make-martingale-bet";
import { Martingale } from "../../domain/entities/martingale";
import { MartingaleStarted } from "../../domain/events/martingale-started";
import { BadRequest } from "../../infra/http/status/bad-request";
import { Broker } from "../ports/brokers/broker";
import { HttpClient } from "../ports/http/http-client";
import { MartingaleRepository } from "../ports/repositories/martingale";

type Dependencies = {
  martingaleRepository: MartingaleRepository;
  httpClient: HttpClient;
  broker: Broker;
};

type Input = {
  martingaleId: string;
  playerId: string;
  initialBet: number;
  rounds: number;
  multiplier: number;
  resetAfter: number;
};

export class StartMartingale {
  private martingaleRepository: MartingaleRepository;
  private broker: Broker;
  private httpClient: HttpClient;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
    this.broker = input.broker;
    this.httpClient = input.httpClient;
  }

  async execute(input: Input): Promise<{ martingaleId: string }> {
    if (input.rounds < 1) throw new BadRequest("There must be at least one round");
    const { data } = await this.httpClient.get(`http://player:3000/player/${input.playerId}/balance`);
    if (data.balance < input.initialBet) throw new BadRequest("Not enough funds");
    const martingale = new Martingale({ id: input.martingaleId, ...input });
    await this.martingaleRepository.create(martingale);
    await this.broker.publish(new MartingaleStarted({ martingaleId: martingale.id, playerId: input.playerId }));
    await this.broker.publish(new MakeMartingaleBet({ martingaleId: martingale.id }));
    return { martingaleId: martingale.id };
  }
}
