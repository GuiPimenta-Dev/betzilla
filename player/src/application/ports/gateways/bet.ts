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
  id: string;
  back: number[];
  lay: number[];
};

export interface BetGateway {
  makeBet(value: number): Promise<{ success: boolean }>;
  consultBet(id: string): Promise<BetStatus>;
  listMatchesForToday(): Promise<Match[]>;
  listMatchMarkets(matchId: string): Promise<Market[]>;
  listMarketOdds(marketId: string): Promise<Odd>;
}
