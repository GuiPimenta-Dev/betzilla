import { Command } from "./command";

export class VerifyBet extends Command {
  constructor(payload: { betId: string }) {
    super("verify-bet", payload);
  }
}
