import { Command } from "./command";

type Payload = {
  martingaleId: string;
};

export class MakeMartingaleBet extends Command {
  constructor(payload: Payload) {
    super("make-martingale-bet", payload);
  }
}
