import { Event } from "./event";

type Input = {
  betId: string;
  playerId: string;
  outcome: number;
};

export class BetWon extends Event {
  constructor(input: Input) {
    super("bet-won", input);
  }
}
