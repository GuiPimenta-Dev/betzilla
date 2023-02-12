import { Bet } from "../entities/bet";
import { Event } from "./event";

export class BetWon extends Event {
  constructor(payload: Bet) {
    super("bet-won", payload);
  }
}
