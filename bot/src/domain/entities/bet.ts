type Input = {
  id: string;
  value: number;
  odd: number;
  matchId: string;
};

export class Bet {
  readonly id: string;
  readonly value: number;
  readonly odd: number;
  readonly matchId: string;
  public outcome: number | null;

  constructor(input: Input) {
    this.id = input.id;
    this.value = input.value;
    this.odd = input.odd;
    this.matchId = input.matchId;
    this.outcome = null;
  }
}
