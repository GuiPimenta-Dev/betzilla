import { MakeMartingaleBet } from "../../domain/commands/make-martingale-bet";
import { Martingale } from "../../domain/entities/martingale";
import { MartingaleStarted } from "../../domain/events/martingale-started";
import { BadRequest } from "../../infra/http/status/bad-request";
import { Broker } from "../ports/brokers/broker";
import { MartingaleRepository } from "../ports/repositories/martingale";

type Dependencies = {
  martingaleRepository: MartingaleRepository;
  broker: Broker;
};

type Input = {
  martingaleId: string;
  playerId: string;
  initialBet: number;
  rounds: number;
  multiplier: number;
};

export class StartMartingale {
  private martingaleRepository: MartingaleRepository;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
    this.broker = input.broker;
  }

  async execute(input: Input): Promise<{ martingaleId: string }> {
    if (input.rounds < 1) throw new BadRequest("There must be at least one round");
    const martingale = new Martingale({ id: input.martingaleId, ...input });
    await this.martingaleRepository.create(martingale);
    await this.broker.publish(new MartingaleStarted({ martingaleId: martingale.id, playerId: input.playerId }));
    await this.broker.publish(new MakeMartingaleBet({ martingaleId: martingale.id }));
    return { martingaleId: martingale.id };
  }
}
