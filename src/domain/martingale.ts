type Input = {
  id: string;
  accountId: string;
  initialBet: number;
  rounds: number;
  multiplier: number;
};

export class Martingale {
  readonly id: string;
  readonly accountId: string;
  readonly initialBet: number;
  readonly multiplier: number;
  private rounds: number;
  private bet: number;

  constructor(input: Input) {
    this.id = input.id;
    this.accountId = input.accountId;
    this.initialBet = input.initialBet;
    this.rounds = input.rounds;
    this.multiplier = input.multiplier;
    this.bet = input.initialBet;
  }

  win() {
    this.decreaseOneRound();
    this.bet = this.initialBet;
  }

  lose() {
    this.decreaseOneRound();
    this.bet *= this.multiplier;
  }

  nextBet() {
    return this.bet;
  }

  isFinished() {
    return this.rounds === 0;
  }

  private decreaseOneRound() {
    this.rounds -= 1;
    if (this.rounds < 0) throw new Error("Martingale Rounds Exceeded");
  }
}
