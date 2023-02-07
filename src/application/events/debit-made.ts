import { Event } from "./event";

type Payload = {
  playerId: string;
  amount: number;
};

export class DebitMadeEvent extends Event {
  constructor(payload: Payload) {
    super("debit-made", payload);
  }
}
