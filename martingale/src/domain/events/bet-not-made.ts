import { Bet } from "../entities/bet";
import { Event } from "./event";

export class BetNotMade extends Event {
  constructor(payload: Bet) {
    super("bet-not-made", payload);
  }
}
