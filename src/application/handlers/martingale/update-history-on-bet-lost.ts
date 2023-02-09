import { BetLostEvent } from "../../../domain/events/player/bet-lost";
import { BadRequest } from "../../../utils/http-status/bad-request";
import { MartingaleRepository } from "../../ports/repositories/martingale";
import { Handler } from "../handler";

type Dependencies = {
  martingaleRepository: MartingaleRepository;
};

export class UpdateHistoryOnBetLostHandler implements Handler {
  name = "bet-lost";
  martingaleRepository: MartingaleRepository;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
  }

  async handle(event: BetLostEvent): Promise<void> {
    const { payload } = event;
    const history = await this.martingaleRepository.findHistory(payload.betId);
    const historyItem = history.find((item) => item.winner === "pending");
    if (!historyItem) throw new BadRequest("Pending history item not found");
    historyItem.winner = false;
    historyItem.outcome = 0;
    historyItem.profit = -historyItem.investiment;
    await this.martingaleRepository.updateHistory(historyItem);
  }
}
