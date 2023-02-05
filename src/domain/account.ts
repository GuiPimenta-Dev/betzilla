type Input = {
  id: string;
  balance: number;
};

export class Account {
  id: string;
  balance: number;

  constructor(input: Input) {
    this.id = input.id;
    this.balance = input.balance;
  }

  debit(amount: number) {
    if (this.balance < amount) throw new Error("Insufficient funds");
    this.balance -= amount;
  }

  credit(amount: number) {
    this.balance += amount;
  }

  getBalance() {
    return this.balance;
  }
}
