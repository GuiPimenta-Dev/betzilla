import { Event } from "../event";

type Payload = {
  playerId: string;
  amount: number;
};

export class CreditMadeEvent extends Event {
  constructor(payload: Payload) {
    super("credit-made", payload);
  }
}
