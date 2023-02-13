import { MakeMartingaleBet } from "../../domain/commands/make-martingale-bet";
import { BetVerified } from "../../domain/events/bet-verified";
import { MartingaleFinished } from "../../domain/events/martingale-finished";
import { Broker } from "../ports/brokers/broker";
import { HttpClient } from "../ports/http/http-client";
import { MartingaleRepository } from "../ports/repositories/martingale";
import { Handler } from "./handler";

type Dependencies = {
  broker: Broker;
  martingaleRepository: MartingaleRepository;
  httpClient: HttpClient;
};

export class BetVerifiedHandler implements Handler {
  name = "bet-verified";
  broker: Broker;
  martingaleRepository: MartingaleRepository;
  httpClient: HttpClient;

  constructor(input: Dependencies) {
    this.broker = input.broker;
    this.martingaleRepository = input.martingaleRepository;
    this.httpClient = input.httpClient;
  }

  async handle(input: BetVerified): Promise<void> {
    const { payload } = input;
    const martingale = await this.martingaleRepository.findById(payload.strategy.id);
    if (martingale.isFinished()) {
      await this.broker.publish(new MartingaleFinished({ martingaleId: martingale.id, status: "finished" }));
      return;
    }
    const { data } = await this.httpClient.get(`http://player:3000/player/${martingale.playerId}/balance`);
    if (data.balance < martingale.getBet()) {
      await this.broker.publish(new MartingaleFinished({ martingaleId: martingale.id, status: "not enough funds" }));
      return;
    }
    const command = new MakeMartingaleBet({ martingaleId: martingale.id });
    await this.broker.publish(command);
  }
}
