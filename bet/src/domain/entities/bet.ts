type Input = {
  id: string;
  value: number;
  matchId: string;
};

export class Bet {
  id: string;
  matchId: string;
  value: number;
  outcome: number;

  constructor(input: Input) {
    this.id = input.id;
    this.value = input.value;
    this.matchId = input.matchId;
    this.outcome = null;
  }
}
