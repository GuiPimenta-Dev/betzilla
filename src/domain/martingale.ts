type Input = {
  id: string;
  initialBet: number;
  rounds: number;
  multiplier: number;
};

export class Martingale {
  readonly id: string;
  readonly initialBet: number;
  readonly multiplier: number;
  public rounds: number;
  private bet: number;

  constructor(input: Input) {
    this.id = input.id;
    this.initialBet = input.initialBet;
    this.rounds = input.rounds;
    this.multiplier = input.multiplier;
    this.bet = input.initialBet;
  }

  play(winner: boolean) {
    this.rounds -= 1;
    if (this.rounds < 0) throw new Error("Martingale Rounds Exceeded");
    winner ? this.win() : this.lose();
  }

  private win() {
    this.bet = this.initialBet;
  }

  private lose() {
    this.bet *= this.multiplier;
  }

  nextBet() {
    return this.bet;
  }
}
