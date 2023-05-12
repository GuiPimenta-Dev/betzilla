import { Event } from "./event";

type Input = {
  matchId: string;
  betValue: number;
};

export class BetMade extends Event {
  constructor(input: Input) {
    super("bet-made", input);
  }
}
