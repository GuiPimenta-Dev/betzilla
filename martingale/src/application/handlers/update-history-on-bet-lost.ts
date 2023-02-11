import { BetLost } from "../../domain/events/bet-lost";
import { BadRequest } from "../../infra/http/status/bad-request";
import { MartingaleRepository } from "../ports/repositories/martingale";
import { Handler } from "./handler";

type Dependencies = {
  martingaleRepository: MartingaleRepository;
};

export class UpdateHistoryOnBetLostHandler implements Handler {
  name = "bet-lost";
  martingaleRepository: MartingaleRepository;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
  }

  async handle(event: BetLost): Promise<void> {
    const { payload } = event;
    const history = await this.martingaleRepository.findHistory(payload.strategy.id);
    const historyItem = history.find((item) => item.itemId === payload.id);
    if (!historyItem) throw new BadRequest("Pending history item not found");
    const item = { ...historyItem };
    item.winner = false;
    item.outcome = 0;
    item.profit = -historyItem.investiment;
    await this.martingaleRepository.updateHistory(item);
  }
}
