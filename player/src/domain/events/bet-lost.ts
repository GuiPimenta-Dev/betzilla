import { Bet } from "../entities/bet";
import { Event } from "./event";

export class BetLost extends Event {
  constructor(payload: Bet) {
    super("bet-lost", payload);
  }
}
