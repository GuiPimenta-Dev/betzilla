import { BetWon } from "../../domain/events/bet-won";
import { MartingaleRepository } from "../ports/repositories/martingale";
import { Handler } from "./handler";

type Dependencies = {
  martingaleRepository: MartingaleRepository;
};

export class BetWonHandler implements Handler {
  name = "bet-won";
  martingaleRepository: MartingaleRepository;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
  }

  async handle(event: BetWon): Promise<void> {
    const { payload } = event;
    const martingale = await this.martingaleRepository.findById(payload.betId);
    martingale.win();
    await this.martingaleRepository.update(martingale);
  }
}
