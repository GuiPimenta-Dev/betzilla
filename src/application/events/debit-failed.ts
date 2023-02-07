import { Event } from "./event";

type Payload = {
  playerId: string;
  amount: number;
};

export class DebitFailedEvent extends Event {
  constructor(payload: Payload) {
    super("debit-failed", payload);
  }
}
