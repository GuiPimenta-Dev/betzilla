import { Bet } from "../entities/bet";
import { Command } from "./command";

export class VerifyOdds extends Command {
  constructor(payload: Bet) {
    super("verify-odds", payload);
  }
}
