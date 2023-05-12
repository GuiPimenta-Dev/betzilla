import { Event } from "./event";

type Input = {
  matchId: string;
};

export class BetLost extends Event {
  constructor(input: Input) {
    super("bet-lost", input);
  }
}
