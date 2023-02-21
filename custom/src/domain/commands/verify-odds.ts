import { CustomStrategy } from "../../application/ports/repositories/strategy";
import { Command } from "./command";

type Match = {
  matchId: string;
  name: string;
};

export class VerifyOdds extends Command {
  constructor(strategy: CustomStrategy, match: Match) {
    super("verify-odds", { strategy, match });
  }
}
