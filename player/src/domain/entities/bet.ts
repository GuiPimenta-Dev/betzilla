type Strategy = {
  id: string;
  name: string;
};

type Input = {
  id: string;
  playerId: string;
  strategy: Strategy;
  value: number;
  attempts: number;
};

export class Bet {
  id: string;
  playerId: string;
  strategy: Strategy;
  value: number;
  outcome: number
  attempts: number

  constructor(input: Input) {
    this.id = input.id;
    this.playerId = input.playerId;
    this.strategy = input.strategy;
    this.value = input.value;
    this.attempts = input.attempts;
  }
}
