import { Bet } from "../entities/bet";
import { Event } from "./event";

export class BetVerified extends Event {
  constructor(payload: Bet) {
    super("bet-verified", payload);
  }
}
