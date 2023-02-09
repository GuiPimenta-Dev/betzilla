import { Command } from "../command";

type Input = {
  martingaleId: string;
  winner: boolean;
  outcome: number;
  profit: number;
};

export class UpdateHistoryItemCommand extends Command {
  constructor(input: Input) {
    super("update-history-item", input);
  }
}
