import { Command } from "./command";

type Match = {
  id: string;
  name: string;
};

export class VerifyOdds extends Command {
  constructor(match: Match) {
    super("verify-odds", { match });
  }
}
