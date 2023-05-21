import { Match, MatchStatus } from "../../entities/match";

import { Rule } from "./rule";

export class IsHalfTime implements Rule {
  constructor(private match: Match) {}

  shouldBet(): boolean {
    return this.match.status === MatchStatus.HALF_TIME;
  }
}
