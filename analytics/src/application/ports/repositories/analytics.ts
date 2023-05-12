import { Bet } from "../../../domain/entities/Bet";

export type StrategyAnalytics = {
  totalDebit: number;
  totalCredit: number;
  totalProfit: number;
  totalWon: number;
  totalLost: number;
  totalPending: number;
  winRate: number;
  roi: number;
};

export interface AnalyticsRepository {
  create(match: Bet): Promise<void>;
  findByMatchId(matchId: string): Promise<Bet>;
  listAllByStrategyId(strategyId: string): Promise<Bet[]>;
  getAnalyticsByStrategyId(strategyId: string): Promise<StrategyAnalytics>;
  update(match: Bet): Promise<void>;
}
