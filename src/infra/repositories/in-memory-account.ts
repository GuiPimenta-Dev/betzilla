import { Account } from "../../domain/account";
import { AccountRepository } from "../../application/ports/repositories/account";

export class InMemoryAccountRepository implements AccountRepository {
  accounts: Account[] = [];

  async findById(id: string): Promise<Account> {
    const account = this.accounts.find((account) => account.id === id);
    if (!account) throw new Error("Account not found");
    return account;
  }

  async update(account: Account): Promise<void> {
    const index = this.accounts.findIndex((a) => a.id === account.id);
    this.accounts[index] = account;
  }

  async create(account: Account): Promise<void> {
    this.accounts.push(account);
  }

  async createDefaultAccount(): Promise<void> {
    const account = new Account({ id: "default", balance: 1000 });
    this.accounts.push(account);
  }
}
