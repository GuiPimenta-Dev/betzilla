type Input = {
  matchId: string;
  match: string;
  strategyId: string;
  playerId: string;
  debit: number;
  status: string;
  credit?: number;
  profit?: number;
  timestamp: Date;
};

export class Bet {
  matchId: string;
  strategyId: string;
  match: string;
  playerId: string;
  debit: number;
  credit?: number;
  profit?: number;
  status: string;
  timestamp: Date;

  constructor(input: Input) {
    this.matchId = input.matchId;
    this.strategyId = input.strategyId;
    this.match = input.match;
    this.playerId = input.playerId;
    this.timestamp = input.timestamp;
    this.debit = input.debit;
    this.credit = input.credit;
    this.profit = input.profit;
    this.status = input.status;
  }
}
