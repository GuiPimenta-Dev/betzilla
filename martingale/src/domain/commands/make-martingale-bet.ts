import { Command } from "./command";

type Payload = {
  martingaleId: string;
  playerId: string;
};

export class MakeMartingaleBet extends Command {
  constructor(payload: Payload) {
    super("make-martingale-bet", payload);
  }
}
