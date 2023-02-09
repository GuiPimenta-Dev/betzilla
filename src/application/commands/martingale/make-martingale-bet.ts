import { Command } from "../command";

type Payload = {
  martingaleId: string;
  playerId: string;
};

export class MakeMartingaleBetCommand extends Command {
  constructor(payload: Payload) {
    super("make-martingale-bet", payload);
  }
}
