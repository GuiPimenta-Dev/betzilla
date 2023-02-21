import { Moment } from "moment";

export type BetStatus = { status: "pending" | "won" | "lost"; outcome: number };

export type Match = {
  id: string;
  name: string;
  date: string;
};

export type Market = {
  id: string;
  name: string;
};

export type Odd = {
  status: string;
  odds: {
    id: string;
    status: string;
    back: number[];
    lay: number[];
  }[];
};

export interface BetGateway {
  makeBet(value: number): Promise<{ success: boolean }>;
  consultBet(id: string): Promise<BetStatus>;
  listMatches(from: Moment, to: Moment): Promise<Match[]>;
  listMatchMarkets(matchId: string): Promise<Market[]>;
  listMarketOdds(marketId: string): Promise<Odd>;
}
