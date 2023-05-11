import { Command } from "./command";

type Input = {
  betId: string;
  playerId: string;
};

export class VerifyBet extends Command {
  constructor(input: Input) {
    super("verify-bet", input);
  }
}
