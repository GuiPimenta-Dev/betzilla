type Input = {
  id: string;
  string: string;
  playerId: string;
  value: number;
};

export class Rule {
  id: string;
  string: string;
  playerId: string;
  value: number;

  constructor(input: Input) {
    this.id = input.id;
    this.string = input.string;
    this.playerId = input.playerId;
    this.value = input.value;
  }
}
