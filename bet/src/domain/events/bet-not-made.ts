import { Event } from "./event";

type Input = {
  matchId: string;
  playerId: string;
  betValue: number;
  reason: string;
};

export class BetNotMade extends Event {
  constructor(input: Input) {
    super("bet-not-made", input);
  }
}
