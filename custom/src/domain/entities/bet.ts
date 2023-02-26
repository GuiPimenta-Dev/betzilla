type Strategy = {
  id: string;
  name: string;
};

type Input = {
  id: string;
  playerId: string;
  value: number;
  strategyId: string;
  odd: number;
};

export class Bet {
  readonly id: string;
  readonly playerId: string;
  readonly strategy: Strategy;
  readonly value: number;
  readonly odd: number;
  public outcome: number | null;
  private _attempts: number;

  constructor(input: Input) {
    this.id = input.id;
    this.strategy = { id: input.strategyId, name: "custom" };
    this.playerId = input.playerId;
    this.value = input.value;
    this.odd = input.odd;
    this.outcome = null;
    this._attempts = 0;
  }

  get attempts() {
    return this._attempts;
  }

  retry() {
    if (this.attempts >= 3) throw new Error("Max attempts reached");
    this._attempts += 1;
  }
}
