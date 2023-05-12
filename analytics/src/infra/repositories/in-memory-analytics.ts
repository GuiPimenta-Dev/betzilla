import { AnalyticsRepository, StrategyAnalytics } from "../../application/ports/repositories/analytics";

import { Bet } from "../../domain/entities/Bet";

export class InMemoryAnalyticsRepository implements AnalyticsRepository {
  matches: Bet[] = [];

  async create(match: Bet): Promise<void> {
    this.matches.push(match);
  }

  async listAllByStrategyId(strategyId: string): Promise<Bet[]> {
    return this.matches.filter((match) => match.strategyId === strategyId);
  }

  async getAnalyticsByStrategyId(strategyId: string): Promise<StrategyAnalytics> {
    const matches = await this.listAllByStrategyId(strategyId);
    const totalDebit = matches.reduce((accumulator, match) => accumulator + match.debit, 0);
    const totalCredit = matches.reduce((accumulator, match) => accumulator + match.credit, 0);
    const totalProfit = totalCredit - totalDebit;
    const totalWon = matches.filter((match) => match.status === "won").length;
    const totalLost = matches.filter((match) => match.status === "lost").length;
    const totalPending = matches.filter((match) => match.status === "pending").length;
    const winRate = parseFloat(((totalWon / (totalWon + totalLost)) * 100).toFixed(2));
    const roi = parseFloat((((totalCredit - totalDebit) / totalDebit) * 100).toFixed(2));
    return {
      totalDebit,
      totalCredit,
      totalProfit,
      totalWon,
      totalLost,
      totalPending,
      winRate,
      roi,
    };
  }

  async findByMatchId(matchId: string): Promise<Bet> {
    return this.matches.find((match) => match.matchId === matchId);
  }

  async update(match: Bet): Promise<void> {
    const index = this.matches.findIndex((matchItem) => matchItem.matchId === match.matchId);
    this.matches[index] = match;
  }
}
