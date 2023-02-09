import { Command } from "../command";

export class DebitAccountCommand extends Command {
  constructor(input: { playerId: string; amount: number }) {
    super("debit-account", input);
  }
}
