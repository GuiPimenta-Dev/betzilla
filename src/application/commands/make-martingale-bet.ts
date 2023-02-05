import { Command } from "./command";

type Payload = {
  id: string;
  playerId: string;
};

export class MakeMartingaleBetCommand extends Command {
  constructor(payload: Payload) {
    super("make-martingale-bet", payload);
  }
}
