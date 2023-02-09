import { BetWonEvent } from "../../../domain/events/player/bet-won";
import { BadRequest } from "../../../utils/http-status/bad-request";
import { MartingaleRepository } from "../../ports/repositories/martingale";
import { Handler } from "../handler";

type Dependencies = {
  martingaleRepository: MartingaleRepository;
};

export class UpdateHistoryOnBetWonHandler implements Handler {
  name = "bet-won";
  martingaleRepository: MartingaleRepository;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
  }

  async handle(event: BetWonEvent): Promise<void> {
    const { payload } = event;
    const history = await this.martingaleRepository.findHistory(payload.betId);
    const historyItem = history.find((item) => item.winner === "pending");
    if (!historyItem) throw new BadRequest("Pending history item not found");
    historyItem.winner = true;
    historyItem.outcome = payload.amount;
    historyItem.profit = payload.amount - historyItem.investiment;
    await this.martingaleRepository.updateHistory(historyItem);
  }
}
