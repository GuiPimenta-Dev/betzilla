import { Event } from "./event";

type Payload = {
  betId: string;
  itemId: string;
};

export class BetLost extends Event {
  constructor(payload: Payload) {
    super("bet-lost", payload);
  }
}
