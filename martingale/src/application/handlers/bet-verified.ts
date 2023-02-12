import { MakeMartingaleBet } from "../../domain/commands/make-martingale-bet";
import { BetVerified } from "../../domain/events/bet-verified";
import { MartingaleFinished } from "../../domain/events/martingale-finished";
import { Broker } from "../ports/brokers/broker";
import { MartingaleRepository } from "../ports/repositories/martingale";
import { Handler } from "./handler";

type Dependencies = {
  broker: Broker;
  martingaleRepository: MartingaleRepository;
};

export class BetVerifiedHandler implements Handler {
  name = "bet-verified";
  broker: Broker;
  martingaleRepository: MartingaleRepository;

  constructor(input: Dependencies) {
    this.broker = input.broker;
    this.martingaleRepository = input.martingaleRepository;
  }

  async handle(input: BetVerified): Promise<void> {
    const { payload } = input;
    const martingale = await this.martingaleRepository.findById(payload.strategy.id);
    if (martingale.isFinished()) {
      return await this.broker.publish(new MartingaleFinished({ martingaleId: martingale.id, reason: "finished" }));
    }
    const command = new MakeMartingaleBet({ martingaleId: martingale.id });
    await this.broker.publish(command);
  }
}
