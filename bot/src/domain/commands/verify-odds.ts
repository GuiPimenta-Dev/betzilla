import { Command } from "./command";

type Input = {
  matchId: string;
  marketId: number;
};

export class VerifyOdds extends Command {
  constructor(input: Input) {
    super("verify-odds", input);
  }
}
