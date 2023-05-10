import { BetGateway, BetStatus, Market, Match, Odd } from "../../../src/application/ports/gateways/bet";

import { v4 as uuid } from "uuid";

export class FakeBetGateway implements BetGateway {
  makeBetResponse: boolean = true;
  consultBetResponse: BetStatus;
  listMatchesForTodayResponse: Match[];
  listMatchMarketsResponse: Market[];
  listMarketOddsResponse: Odd[];
  marketOddsIndex: number = 0;

  async makeBet(): Promise<{ success: boolean; betId: string }> {
    return { success: this.makeBetResponse, betId: uuid() };
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

  async listMarketOdds(): Promise<Odd[]> {
    return this.listMarketOddsResponse;
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
