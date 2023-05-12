import { Event } from "./event";

type Input = {
  matchId: string;
  outcome: number;
};

export class BetWon extends Event {
  constructor(input: Input) {
    super("bet-won", input);
  }
}
