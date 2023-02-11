import { BetMade } from "../../domain/events/bet-made";
import { MartingaleRepository } from "../ports/repositories/martingale";
import { Handler } from "./handler";

type Dependencies = {
  martingaleRepository: MartingaleRepository;
};

export class BetMadeHandler implements Handler {
  name = "bet-made";
  private martingaleRepository: MartingaleRepository;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
  }

  async handle(input: BetMade): Promise<void> {
    const { payload } = input;
    const item = {
      itemId: payload.id,
      martingaleId: payload.strategy.id,
      winner: "pending",
      investiment: payload.value,
      outcome: 0,
    };
    await this.martingaleRepository.saveHistory(item);
  }
}
