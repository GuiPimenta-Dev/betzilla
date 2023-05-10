import { Event } from "./event";

type Input = {
  matchId: string;
  betId: string;
};

export class BetMade extends Event {
  constructor(payload: Input) {
    super("bet-made", payload);
  }
}
