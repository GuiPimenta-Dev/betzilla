import { Match, MatchStatus } from "../../../src/domain/entities/match";

export class MatchBuilder {
  matchStatus: MatchStatus;
  date: string;
  betId: string;

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

  withDate(date: Date): MatchBuilder {
    this.date = date.toISOString();
    return this;
  }

  withBetId(betId: string): MatchBuilder {
    this.betId = betId;
    return this;
  }

  public build(): Match {
    const match = Match.start({
      id: "matchId",
      name: "A X B",
      date: this.date,
      botId: "botId",
    });
    if (this.matchStatus === MatchStatus.FULL_TIME) {
      match.finishHalfTime();
    }
    if (this.matchStatus === MatchStatus.FINISHED) {
      match.finish();
    }
    if (this.betId) {
      match.makeBet(this.betId);
    }
    return match;
  }
}
