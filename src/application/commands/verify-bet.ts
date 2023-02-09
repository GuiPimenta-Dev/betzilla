import { Command } from "./command";

export class VerifyBetCommand extends Command {
  constructor(payload: { betId: string }) {
    super("verify-bet", payload);
  }
}
