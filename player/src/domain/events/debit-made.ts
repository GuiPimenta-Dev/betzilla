import { Bet } from "../entities/bet";
import { Event } from "./event";

export class DebitMade extends Event {
  constructor(payload: Bet) {
    super("debit-made", payload);
  }
}
