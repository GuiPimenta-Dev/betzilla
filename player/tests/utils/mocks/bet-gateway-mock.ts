import { BetGateway, BetStatus, Market, Match, Odd } from "../../../src/application/ports/gateways/bet";

export class BetGatewayMock implements BetGateway {
  makeBetResponse: boolean = true;
  consultBetResponse: BetStatus;

  async makeBet(): Promise<{ success: boolean }> {
    return { success: this.makeBetResponse };
  }

  async consultBet(): Promise<BetStatus> {
    return this.consultBetResponse;
  }

  listMatches(): Promise<Match[]> {
    throw new Error("Method not implemented.");
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
}
