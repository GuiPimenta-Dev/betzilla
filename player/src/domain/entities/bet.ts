type Strategy = {
  id: string;
  name: string;
};

type Input = {
  id: string;
  playerId: string;
  strategy: Strategy;
  value: number;
};

export class Bet {
  id: string;
  playerId: string;
  strategy: Strategy;
  value: number;
  outcome: number;

  constructor(input: Input) {
    this.id = input.id;
    this.playerId = input.playerId;
    this.strategy = input.strategy;
    this.value = input.value;
  }
}
