import { Odd } from "../events/odds-verified";
import { Match } from "./match";

export type ShouldBet = {
  shouldBet: boolean;
  bet?: {
    id: string;
    odd: number;
  };
};

type Input = {
  rule: string;
  match: Match;
};

export class Strategy {
  rule: string;
  match: Match;

  constructor(input: Input) {
    this.rule = input.rule;
    this.match = input.match;
  }

  verify(odd: Odd[]): ShouldBet {
    return { shouldBet: false };
  }
}
