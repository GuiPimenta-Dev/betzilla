import { AccountRepository } from "../ports/repositories/account";
import { CreditAccountCommand } from "../commands/credit-account";
import { Handler } from "./handler";

type Dependencies = {
  accountRepository: AccountRepository;
};

export class CreditAccountHandler implements Handler {
  name = "credit-account";
  private accountRepository: AccountRepository;

  constructor(input: Dependencies) {
    this.accountRepository = input.accountRepository;
  }

  async handle(input: CreditAccountCommand): Promise<void> {
    const { payload } = input;
    const account = await this.accountRepository.findById(payload.accountId);
    account.credit(payload.amount);
    await this.accountRepository.update(account);
  }
}
