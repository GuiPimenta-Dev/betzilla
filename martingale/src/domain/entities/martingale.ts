type Input = {
  id: string;
  playerId: string;
  initialBet: number;
  rounds: number;
  multiplier: number;
  resetAfter: number;
};

export class Martingale {
  readonly id: string;
  readonly playerId: string;
  readonly initialBet: number;
  readonly multiplier: number;
  readonly resetAfter: number;
  public status: string | null;
  private rounds: number;
  private bet: number;
  roundsLost: number = 0;

  constructor(input: Input) {
    this.id = input.id;
    this.playerId = input.playerId;
    this.initialBet = input.initialBet;
    this.rounds = input.rounds;
    this.multiplier = input.multiplier;
    this.resetAfter = input.resetAfter;
    this.bet = input.initialBet;
    this.status = "playing";
  }

  win() {
    this.decreaseOneRound();
    this.roundsLost = 0;
    this.bet = this.initialBet;
  }

  lose() {
    this.decreaseOneRound();
    this.roundsLost += 1;
    if (this.roundsLost >= this.resetAfter) {
      this.bet = this.initialBet;
      this.roundsLost = 0;
    }else {
      this.bet *= this.multiplier;
    }
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
