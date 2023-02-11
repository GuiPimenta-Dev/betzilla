import { BetWon } from "../../domain/events/bet-won";
import { MartingaleRepository } from "../ports/repositories/martingale";
import { Handler } from "./handler";

type Dependencies = {
  martingaleRepository: MartingaleRepository;
};

export class UpdateHistoryOnBetWonHandler implements Handler {
  name = "bet-won";
  martingaleRepository: MartingaleRepository;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
  }

  async handle(event: BetWon): Promise<void> {
    const { payload } = event;
    const history = await this.martingaleRepository.findHistory(payload.strategy.id);
    const historyItem = history.find((item) => item.itemId === payload.id);
    const item = { ...historyItem };
    item.winner = true;
    item.outcome = payload.outcome;
    item.profit = payload.outcome - item.investiment;
    await this.martingaleRepository.updateHistory(item);
  }
}
