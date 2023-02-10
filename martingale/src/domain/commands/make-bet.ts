import { Command } from "./command";

type Payload = {
  betId: string;
  betValue: number;
  playerId: string;
};

export class MakeBet extends Command {
  constructor(payload: Payload) {
    super("make-bet", payload);
  }
}
