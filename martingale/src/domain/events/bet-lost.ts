import { Event } from "./event";

type Payload = {
  betId: string;
};

export class BetLost extends Event {
  constructor(payload: Payload) {
    super("bet-lost", payload);
  }
}
