import { Command } from "./command";

export class VerifyMartingaleCommand extends Command {
  constructor(payload: { martingaleId: string }) {
    super("verify-martingale", payload);
  }
}
