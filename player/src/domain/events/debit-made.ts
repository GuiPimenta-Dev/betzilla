import { Event } from "./event";

type Payload = {
  playerId: string;
  value: number;
};

export class DebitMade extends Event {
  constructor(payload: Payload) {
    super("debit-made", payload);
  }
}
