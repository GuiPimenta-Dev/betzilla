import { Bet } from "../entities/bet";
import { Command } from "./command";

export class MakeBet extends Command {
  constructor(payload: Bet) {
    super("make-bet", payload);
  }
}
