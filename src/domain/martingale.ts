type Input = {
  id: string;
  playerId: string;
  initialBet: number;
  rounds: number;
  multiplier: number;
};

export class Martingale {
  readonly id: string;
  readonly playerId: string;
  readonly initialBet: number;
  readonly multiplier: number;
  private rounds: number;
  private bet: number;

  constructor(input: Input) {
    this.id = input.id;
    this.playerId = input.playerId;
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

  getBet() {
    return this.bet;
  }

  isFinished() {
    return this.rounds <= 0;
  }

  private decreaseOneRound() {
    this.rounds -= 1;
    if (this.rounds < 0) throw new Error("Martingale Rounds Exceeded");
  }
}
