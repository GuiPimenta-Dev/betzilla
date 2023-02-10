import { Event } from "./event";

type Payload = {
  betId: string;
  betValue: number;
};

export class BetMade extends Event {
  constructor(payload: Payload) {
    super("bet-made", payload);
  }
}
