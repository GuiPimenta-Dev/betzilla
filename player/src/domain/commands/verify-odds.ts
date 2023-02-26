import { Command } from "./command";

type Match = {
  id: string;
  name: string;
};

type Input = {
  strategyId: string;
  match: Match;
  marketName: string;
};

export class VerifyOdds extends Command {
  constructor(payload: Input) {
    super("verify-odds", payload);
  }
}
