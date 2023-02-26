type Strategy = {
  id: string;
  name: string;
};

type Input = {
  id: string;
  playerId: string;
  value: number;
  strategy: Strategy;
  odd: number;
};

export class Bet {
  readonly id: string;
  readonly playerId: string;
  readonly strategy: Strategy;
  readonly value: number;
  readonly odd: number;
  public outcome: number | null;

  constructor(input: Input) {
    this.id = input.id;
    this.strategy = input.strategy;
    this.playerId = input.playerId;
    this.value = input.value;
    this.odd = input.odd;
    this.outcome = null;
  }
}
