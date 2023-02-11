import { Bet } from "../entities/bet";
import { Event } from "./event";

export class BetMade extends Event {
  constructor(payload: Bet) {
    super("bet-made", payload);
  }
}
