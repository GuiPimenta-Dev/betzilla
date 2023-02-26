import { BetGateway, BetStatus, Market, Match, Odd } from "../../../src/application/ports/gateways/bet";

export class FakeBetGateway implements BetGateway {
  makeBetResponse: boolean = true;
  consultBetResponse: BetStatus;
  listMatchesForTodayResponse: Match[];
  listMatchMarketsResponse: Market[];
  listMarketOddsResponse: Odd;

  async makeBet(): Promise<{ success: boolean }> {
    return { success: this.makeBetResponse };
  }

  async consultBet(): Promise<BetStatus> {
    return this.consultBetResponse;
  }

  async listMatchesForToday(): Promise<Match[]> {
    return this.listMatchesForTodayResponse;
  }

  async listMatchMarkets(): Promise<Market[]> {
    return this.listMatchMarketsResponse;
  }

  async listMarketOdds(): Promise<Odd> {
    return this.listMarketOddsResponse;
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

  mocklistMatchMarketsResponse(markets: Market[]) {
    this.listMatchMarketsResponse = markets;
  }

  mockListMarketOddsResponse(odds: Odd) {
    this.listMarketOddsResponse = odds;
  }
}
