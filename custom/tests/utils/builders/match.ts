import { Match, MatchStatus } from "../../../src/domain/entities/match";

export class MatchBuilder {
  matchStatus: MatchStatus;

  static aUpcoming(): MatchBuilder {
    const match = new MatchBuilder();
    match.matchStatus = MatchStatus.UPCOMING;
    return match;
  }

  static aInProgress(): MatchBuilder {
    const match = new MatchBuilder();
    match.matchStatus = MatchStatus.IN_PROGRESS;
    return match;
  }

  static aFinished(): MatchBuilder {
    const match = new MatchBuilder();
    match.matchStatus = MatchStatus.FINISHED;
    return match;
  }

  public build(): Match {
    const match = new Match({ id: "matchId", name: "A X B", date: "today", strategyId: "strategyId" });
    if (this.matchStatus === MatchStatus.IN_PROGRESS) {
      match.startGame();
    }
    if (this.matchStatus === MatchStatus.FINISHED) {
      match.finishGame();
    }
    return match;
  }
}
