import { Command } from "../command";

export class CreditAccountCommand extends Command {
  name = "credit-account";

  constructor(input: { playerId: string; amount: number }) {
    super("credit-player-account", input);
  }
}
