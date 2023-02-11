import { Bet } from "../entities/bet";
import { Event } from "./event";

export class BetWon extends Event {
  constructor(payload: Bet & { outcome: number }) {
    super("bet-won", payload);
  }
}
