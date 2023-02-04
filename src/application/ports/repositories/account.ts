import { Account } from "../../../domain/account";

export interface AccountRepository {
  findById(id: string): Promise<Account>;
  update(account: Account): Promise<void>;
  create(account: Account): Promise<void>;
}
