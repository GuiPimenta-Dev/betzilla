import { UpdateHistoryItemCommand } from "../../../domain/commands/martingale/update-pending-history-item";
import { BadRequest } from "../../../utils/http-status/bad-request";
import { MartingaleRepository } from "../../ports/repositories/martingale";
import { Handler } from "../handler";

type Dependencies = {
  martingaleRepository: MartingaleRepository;
};

export class UpdateHistoryItemHandler implements Handler {
  name = "update-history-item";
  martingaleRepository: MartingaleRepository;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
  }

  async handle(command: UpdateHistoryItemCommand): Promise<void> {
    const { payload } = command;
    const history = await this.martingaleRepository.findHistory(payload.martingaleId);
    const historyItem = history.find((item) => item.winner === "pending");
    if (!historyItem) throw new BadRequest("Pending history item not found");
    historyItem.winner = payload.winner;
    historyItem.outcome = payload.outcome;
    historyItem.profit = payload.profit;
    await this.martingaleRepository.updateHistory(historyItem);
  }
}
