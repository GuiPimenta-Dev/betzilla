import { BetLost } from "../../domain/events/bet-lost";
import { MartingaleRepository } from "../ports/repositories/martingale";
import { Handler } from "./handler";

type Dependencies = {
  martingaleRepository: MartingaleRepository;
};

export class BetLostHandler implements Handler {
  name = "bet-lost";
  martingaleRepository: MartingaleRepository;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
  }

  async handle(event: BetLost): Promise<void> {
    const { payload } = event;
    const martingale = await this.martingaleRepository.findById(payload.strategy.id);
    martingale.lose();
    await this.martingaleRepository.update(martingale);
  }
}
