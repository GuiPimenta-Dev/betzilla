import { Command } from "./command";

type Input = {
  matchId: string;
  market: string;
};

export class VerifyOdds extends Command {
  constructor(input: Input) {
    super("verify-odds", input);
  }
}
