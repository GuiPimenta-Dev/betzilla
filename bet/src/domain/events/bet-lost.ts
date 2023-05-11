import { Event } from "./event";

type Input = {
  betId: string;
  playerId: string;
  betValue: number;
};

export class BetLost extends Event {
  constructor(input: Input) {
    super("bet-lost", input);
  }
}
