import { Command } from "./command";

type Input = {
  matchId: string;
  marketId: string;
  oddId: string;
  type: string;
  odd: number;
  betValue: number;
  playerId: string;
};

export class MakeBet extends Command {
  constructor(input: Input) {
    super("make-bet", input);
  }
}
