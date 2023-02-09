import { Event } from "./event";

type Payload = {
  betId: string;
};

export class BetLostEvent extends Event {
  constructor(payload: Payload) {
    super("bet-lost", payload);
  }
}
