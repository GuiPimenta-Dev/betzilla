import { BetGateway, BetStatus, Market, Match, Odd } from "../../../src/application/ports/gateways/bet";

export class BetGatewayMock implements BetGateway {
  makeBetResponse: boolean = true;
  consultBetResponse: BetStatus;
  listMatchesForTodayResponse: Match[];

  async makeBet(): Promise<{ success: boolean }> {
    return { success: this.makeBetResponse };
  }

  async consultBet(): Promise<BetStatus> {
    return this.consultBetResponse;
  }

  async listMatchesForToday(): Promise<Match[]> {
    return this.listMatchesForTodayResponse;
  }
  listMatchMarkets(matchId: string): Promise<Market[]> {
    throw new Error("Method not implemented.");
  }
  listMarketOdds(marketId: string): Promise<Odd> {
    throw new Error("Method not implemented.");
  }

  mockMakeBetResponse(betWasMade: boolean) {
    this.makeBetResponse = betWasMade;
  }

  mockConsultBetResponse(bet: BetStatus) {
    this.consultBetResponse = bet;
  }

  mockListMatchesForTodayResponse(matches: Match[]) {
    this.listMatchesForTodayResponse = matches;
  }
}
