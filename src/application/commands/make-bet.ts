import { Command } from "./command";

type Payload = {
  betId: string;
  playerId: string;
  betValue: number;
};

export class MakeBetCommand extends Command {
  constructor(payload: Payload) {
    super("make-bet", payload);
  }
}
