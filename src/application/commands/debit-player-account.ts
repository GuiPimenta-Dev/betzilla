import { Command } from "./command";

export class DebitPlayerAccountCommand extends Command {
  constructor(input: { playerId: string; amount: number }) {
    super("debit-player-account", input);
  }
}
