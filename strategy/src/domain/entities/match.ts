import { Odd } from "../events/odds-verified";

type MatchTeam = {
  name: string;
  score: number;
};

export type Market = {
  id: string;
  name: string;
  odds: Odd;
};

export enum MatchStatus {
  HALF_TIME = "half-time",
  FULL_TIME = "full-time",
  FINISHED = "finished",
}

type Input = {
  id: string;
  name: string;
  date: string;
  strategyId: string;
  markets: Market[];
  home?: MatchTeam;
  away?: MatchTeam;
  status?: MatchStatus;
  betId?: string;
};

export class Match {
  readonly id: string;
  readonly name: string;
  readonly date: string;
  readonly strategyId: string;
  readonly markets: Market[];
  private _status: MatchStatus;
  private _home: MatchTeam;
  private _away: MatchTeam;
  private _betId: string;

  constructor(input: Input) {
    this.id = input.id;
    this.name = input.name;
    this.date = input.date;
    this.strategyId = input.strategyId;
    this.markets = input.markets;
    this._home = input.home;
    this._away = input.away;
    this._status = input.status;
    this._betId = input.betId;
  }

  static start(input: Input): Match {
    const [homeTeamName, awayTeamName] = input.name.split(" X ");
    const home = { name: homeTeamName, score: 0 };
    const away = { name: awayTeamName, score: 0 };
    const status = MatchStatus.HALF_TIME;
    return new Match({ ...input, home, away, status });
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

  get betId(): string {
    return this._betId;
  }

  setScore(homeScore: number, awayScore: number): void {
    this._home.score = homeScore;
    this._away.score = awayScore;
  }

  finishHalfTime(): void {
    this._status = MatchStatus.FULL_TIME;
  }

  finish(): void {
    this._status = MatchStatus.FINISHED;
  }

  makeBet(betId: string): void {
    this._betId = betId;
  }
}
