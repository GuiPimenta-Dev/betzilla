import { Command } from "./command";

export class CreditPlayerAccountCommand extends Command {
  name = "credit-player-account";

  constructor(input: { playerId: string; amount: number }) {
    super("credit-player-account", input);
  }
}
