import { Command } from "./command";

export class CreditAccountCommand extends Command {
  name = "credit-account";

  constructor(input: { accountId: string; amount: number }) {
    super("credit-account", input);
  }
}
