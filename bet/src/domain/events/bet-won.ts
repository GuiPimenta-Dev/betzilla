import { Event } from "./event";

type Input = {
  matchId: string;
  betId: string;
  playerId: string;
  outcome: number;
};

export class BetWon extends Event {
  constructor(input: Input) {
    super("bet-won", input);
  }
}
