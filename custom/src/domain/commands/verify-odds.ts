import { StrategyInfo } from "../../application/ports/repositories/strategy";
import { Command } from "./command";

type Match = {
  id: string;
  name: string;
};

export class VerifyOdds extends Command {
  constructor(strategy: StrategyInfo, match: Match) {
    super("verify-odds", { strategy, match });
  }
}
