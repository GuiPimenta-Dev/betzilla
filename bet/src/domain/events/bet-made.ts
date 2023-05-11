import { Event } from "./event";

type Input = {
  matchId: string;
  betId: string;
  playerId: string;
  betValue: number;
};

export class BetMade extends Event {
  constructor(input: Input) {
    super("bet-made", input);
  }
}
