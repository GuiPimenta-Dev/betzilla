import { v4 as uuid } from "uuid";
import { BetMadeEvent } from "../../../domain/events/player/bet-made";
import { MartingaleRepository } from "../../ports/repositories/martingale";
import { Handler } from "../handler";

type Dependencies = {
  martingaleRepository: MartingaleRepository;
};

export class BetMadeHandler implements Handler {
  name = "bet-made";
  private martingaleRepository: MartingaleRepository;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
  }

  async handle(input: BetMadeEvent): Promise<void> {
    const { payload } = input;
    const item = { itemId: uuid(), martingaleId: payload.betId, winner: "pending", investiment: payload.betValue };
    await this.martingaleRepository.saveHistory(item);
  }
}
