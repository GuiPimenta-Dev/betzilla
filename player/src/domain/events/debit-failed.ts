import { Event } from "./event";

type Payload = {
  playerId: string;
  value: number;
};

export class DebitFailed extends Event {
  constructor(payload: Payload) {
    super("debit-failed", payload);
  }
}
