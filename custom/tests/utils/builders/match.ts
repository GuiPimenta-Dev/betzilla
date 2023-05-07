import { Market, Match, MatchStatus } from "../../../src/domain/entities/match";

export class MatchBuilder {
  matchStatus: MatchStatus;
  markets: Market[] = [];

  static aMatch(): MatchBuilder {
    return new MatchBuilder();
  }

  static aFullTimeMatch(): MatchBuilder {
    const match = new MatchBuilder();
    match.matchStatus = MatchStatus.FULL_TIME;
    return match;
  }

  static aFinishedMatch(): MatchBuilder {
    const match = new MatchBuilder();
    match.matchStatus = MatchStatus.FINISHED;
    return match;
  }

  withMarkets(markets: Market[]): MatchBuilder {
    this.markets = markets;
    return this;
  }

  public build(): Match {
    const match = Match.start({ id: "matchId", name: "A X B", date: "today", rule: "rule", markets: this.markets });
    if (this.matchStatus === MatchStatus.FULL_TIME) {
      match.finishHt();
    }
    if (this.matchStatus === MatchStatus.FINISHED) {
      match.finish();
    }
    return match;
  }
}
