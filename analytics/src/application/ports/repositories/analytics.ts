import { Bet } from "../../../domain/entities/Bet";

export type BotAnalytics = {
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
  listAllByBotId(botId: string): Promise<Bet[]>;
  getAnalyticsByBotId(botId: string): Promise<BotAnalytics>;
  update(match: Bet): Promise<void>;
}
