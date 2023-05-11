import { Command } from "./command";

type Input = {
  matchId: string;
  market: string;
};

export class VerifyOdds extends Command {
  constructor(payload: Input) {
    super("verify-odds", payload);
  }
}
