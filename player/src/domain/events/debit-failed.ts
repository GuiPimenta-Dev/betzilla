import { Bet } from "../entities/bet";
import { Event } from "./event";

export class DebitFailed extends Event {
  constructor(payload: Bet) {
    super("debit-failed", payload);
  }
}
