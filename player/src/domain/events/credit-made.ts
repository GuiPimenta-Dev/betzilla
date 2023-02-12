import { Bet } from "../entities/bet";
import { Event } from "./event";

export class CreditMade extends Event {
  constructor(payload: Bet & { credit: number }) {
    super("credit-made", payload);
  }
}
