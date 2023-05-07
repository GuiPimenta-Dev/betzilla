import { Match, MatchStatus } from "../../../src/domain/entities/match";

export class MatchBuilder {
  matchStatus: MatchStatus;

  static aUpcoming(): MatchBuilder {
    const match = new MatchBuilder();
    match.matchStatus = MatchStatus.UPCOMING;
    return match;
  }

  static aHalfTime(): MatchBuilder {
    const match = new MatchBuilder();
    match.matchStatus = MatchStatus.HALF_TIME;
    return match;
  }

  static aFullTime(): MatchBuilder {
    const match = new MatchBuilder();
    match.matchStatus = MatchStatus.FULL_TIME;
    return match;
  }

  static aFinished(): MatchBuilder {
    const match = new MatchBuilder();
    match.matchStatus = MatchStatus.FINISHED;
    return match;
  }

  public build(): Match {
    const match = new Match({ id: "matchId", name: "A X B", date: "today", strategyId: "strategyId" });
    if (this.matchStatus === MatchStatus.HALF_TIME) {
      match.start();
    }
    if (this.matchStatus === MatchStatus.FULL_TIME) {
      match.finishHt();
    }
    if (this.matchStatus === MatchStatus.FINISHED) {
      match.finish();
    }
    return match;
  }
}
