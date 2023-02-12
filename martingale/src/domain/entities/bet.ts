import { v4 as uuid } from "uuid";

type Strategy = {
  id: string;
  name: string;
};

type Input = {
  playerId: string;
  value: number;
  martingaleId: string;
};

export class Bet {
  readonly id: string;
  readonly playerId: string;
  readonly strategy: Strategy;
  readonly value: number;

  constructor(input: Input) {
    this.id = uuid();
    this.strategy = { id: input.martingaleId, name: "martingale" };
    this.playerId = input.playerId;
    this.value = input.value;
  }
}