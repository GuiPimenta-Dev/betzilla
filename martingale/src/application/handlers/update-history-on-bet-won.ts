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
    const history = await this.martingaleRepository.findHistory(payload.betId);
    const historyItem = history.find((item) => item.winner === "pending");
    historyItem.winner = true;
    historyItem.outcome = payload.amount;
    historyItem.profit = payload.amount - historyItem.investiment;
    await this.martingaleRepository.updateHistory(historyItem);
  }
}
