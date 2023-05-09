import { BetGateway, BetStatus, Market, Match, Odd } from "../../../src/application/ports/gateways/bet";

export class FakeBetGateway implements BetGateway {
  makeBetResponse: boolean = true;
  consultBetResponse: BetStatus;
  listMatchesForTodayResponse: Match[];
  listMatchMarketsResponse: Market[];
  listMarketOddsResponse: Odd[];
  marketOddsIndex: number = 0;

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
    return this.listMarketOddsResponse[this.marketOddsIndex++];
  }

  mockMakeBet(betWasMade: boolean) {
    this.makeBetResponse = betWasMade;
  }

  mockConsultBet(bet: BetStatus) {
    this.consultBetResponse = bet;
  }

  mockListMatchesForToday(matches: Match[]) {
    this.listMatchesForTodayResponse = matches;
  }

  mockListMatchMarkets(markets: Market[]) {
    this.listMatchMarketsResponse = markets;
  }

  mockListMarketOdds(odds: any) {
    this.listMarketOddsResponse = odds;
  }
}
