import { Event } from "./event";

type Payload = {
  playerId: string;
  value: number;
};

export class CreditMade extends Event {
  constructor(payload: Payload) {
    super("credit-made", payload);
  }
}
