import { VerifyBet } from "../../domain/commands/verify-bet";
import { BetMade } from "../../domain/events/bet-made";
import { Broker } from "../ports/brokers/broker";
import { MartingaleRepository } from "../ports/repositories/martingale";
import { Handler } from "./handler";

type Dependencies = {
  broker: Broker;
  martingaleRepository: MartingaleRepository;
};

export class BetMadeHandler implements Handler {
  name = "bet-made";
  private broker: Broker;
  private martingaleRepository: MartingaleRepository;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
    this.broker = input.broker;
  }

  async handle(input: BetMade): Promise<void> {
    const { payload } = input;
    await this.martingaleRepository.createHistoryItem({
      betId: payload.id,
      martingaleId: payload.strategy.id,
      winner: "pending",
      investiment: payload.value,
      outcome: null,
      profit: null,
    });
    await this.broker.schedule(new VerifyBet(payload));
  }
}
