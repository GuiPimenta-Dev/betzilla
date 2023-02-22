import { BetGateway, BetStatus, Market, Match, Odd } from "../../../src/application/ports/gateways/bet";

export class FakeBetGateway implements BetGateway {
  bet: number;

  async makeBet(bet: number): Promise<{ success: true }> {
    this.bet = bet;
    return { success: true };
  }

  async consultBet(): Promise<BetStatus> {
    if (Math.random() <= 0.5) return { status: "won", outcome: this.bet * 2 };
    return { status: "lost", outcome: 0 };
  }

  listTodayMatches(): Promise<Match[]> {
    throw new Error("Method not implemented.");
  }
  listMatchMarkets(matchId: string): Promise<Market[]> {
    throw new Error("Method not implemented.");
  }
  listMarketOdds(marketId: string): Promise<Odd> {
    throw new Error("Method not implemented.");
  }
}
