import { Account } from "./account";

type Input = {
  id: string;
  email: string;
  balance: number;
};

export class Player {
  readonly id: string;
  readonly email: string;
  readonly account: Account;
  private bets: string[] = [];

  constructor(input: Input) {
    this.id = input.id;
    this.email = input.email;
    this.account = new Account({ balance: input.balance });
  }

  makeBet(betId: string) {
    this.bets.push(betId);
  }

  getBets() {
    return this.bets;
  }
}
