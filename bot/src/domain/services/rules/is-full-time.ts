import { Match, MatchStatus } from "../../entities/match";

import { Rule } from "./rule";

export class IsFullTime implements Rule {
  constructor(private match: Match) {}

  shouldBet(): boolean {
    return this.match.status === MatchStatus.FULL_TIME;
  }
}
