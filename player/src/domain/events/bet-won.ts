import { Event } from "./event";

type Payload = {
  betId: string;
  outcome: number;
};

export class BetWon extends Event {
  constructor(payload: Payload) {
    super("bet-won", payload);
  }
}
