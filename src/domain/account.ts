export class Account {
  balance: number;

  constructor(input: { balance: number }) {
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