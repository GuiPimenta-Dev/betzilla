type Teams = {
  home: MatchTeam;
  away: MatchTeam;
};

type MatchTeam = {
  name: string;
  score: number;
};

export enum MatchStatus {
  UPCOMING = "upcoming",
  IN_PROGRESS = "in-progress",
  FINISHED = "finished",
}

type Input = {
  id: string;
  name: string;
  strategyId: string;
};

export class Match {
  readonly id: string;
  readonly name: string;
  readonly strategyId: string;
  private _status: MatchStatus;
  private _home: MatchTeam;
  private _away: MatchTeam;

  constructor(input: Input) {
    this.id = input.id;
    this.name = input.name;
    this.strategyId = input.strategyId;
    const { home, away } = this.getHomeAndAwayTeam(input.name);
    this._home = home;
    this._away = away;
    this._status = MatchStatus.UPCOMING;
  }

  get status(): MatchStatus {
    return this._status;
  }

  get home(): MatchTeam {
    return this._home;
  }

  get away(): MatchTeam {
    return this._away;
  }

  setScore(homeScore: number, awayScore: number): void {
    this._home.score = homeScore;
    this._away.score = awayScore;
  }

  startGame(): void {
    this._status = MatchStatus.IN_PROGRESS;
  }

  finishGame(): void {
    this._status = MatchStatus.FINISHED;
  }

  private getHomeAndAwayTeam(matchName: string): Teams {
    const [homeTeamName, awayTeamName] = matchName.split(" X ");
    return { home: { name: homeTeamName, score: 0 }, away: { name: awayTeamName, score: 0 } };
  }
}
