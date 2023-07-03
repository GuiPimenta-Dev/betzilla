import { Command } from "./command";

type Input = {
  matchId: string;
  marketId: number;
};

export class VerifyOdds extends Command {
  constructor(payload: Input) {
    super("verify-odds", payload);
  }
}
