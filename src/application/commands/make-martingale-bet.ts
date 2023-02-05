import { Command } from "./command";

type Payload = {
  id: string;
  accountId: string;
  betValue: number;
};

export class MakeMartingaleBetCommand extends Command {
  constructor(payload: Payload) {
    super("make-martingale-bet", payload);
  }
}
