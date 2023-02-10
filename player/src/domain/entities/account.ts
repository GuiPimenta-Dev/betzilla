export class Account {
  balance: number;

  constructor(input: { balance: number }) {
    this.balance = input.balance;
  }

  debit(outcome: number) {
    if (this.balance < outcome) throw new Error("Insufficient funds");
    this.balance -= outcome;
  }

  credit(outcome: number) {
    this.balance += outcome;
  }

  getBalance() {
    return this.balance;
  }
}
