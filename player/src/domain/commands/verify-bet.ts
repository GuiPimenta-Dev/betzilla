import { Bet } from "../entities/bet";
import { Command } from "./command";

export class VerifyBet extends Command {
  constructor(payload: Bet) {
    super("verify-bet", payload);
  }
}
