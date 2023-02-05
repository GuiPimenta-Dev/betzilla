import { Command } from "./command";

export class VerifyMartingaleCommand extends Command {
  constructor(payload: { id: string }) {
    super("verify-martingale", payload);
  }
}
