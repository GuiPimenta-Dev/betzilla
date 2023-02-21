import { BetGateway, BetStatus, Market, Match, Odd } from "../../application/ports/gateways/bet";

import { BetFairAdapter } from "../gateways/bet-fair-adapter";
import { HttpError } from "../http/status/http-error";

export class BetFairProxy implements BetGateway {
  constructor(private betFairAdapter: BetFairAdapter) {}

  async login(): Promise<void> {
    await this.betFairAdapter.login();
  }

  async makeBet(value: number): Promise<{ success: boolean }> {
    let response: any;
    try {
      response = await this.betFairAdapter.makeBet(value);
    } catch (error) {
      await this.verifyError(error);
      response = await this.betFairAdapter.makeBet(value);
    }
    return response;
  }

  async consultBet(id: string): Promise<BetStatus> {
    let response: any;
    try {
      response = await this.betFairAdapter.consultBet(id);
    } catch (error) {
      await this.verifyError(error);
      response = await this.betFairAdapter.consultBet(id);
    }
    return response;
  }

  async listTodaysMatches(): Promise<Match[]> {
    let response: any;
    try {
      response = await this.betFairAdapter.listTodaysMatches();
    } catch (error) {
      await this.verifyError(error);
      response = await this.betFairAdapter.listTodaysMatches();
    }
    return response;
  }

  async listMatchMarkets(matchId: string): Promise<Market[]> {
    let response: any;
    try {
      response = await this.betFairAdapter.listMatchMarkets(matchId);
    } catch (error) {
      await this.verifyError(error);
      response = await this.betFairAdapter.listMatchMarkets(matchId);
    }
    return response;
  }

  async listMarketOdds(marketId: string): Promise<Odd> {
    let response: any;
    try {
      response = await this.betFairAdapter.listMarketOdds(marketId);
    } catch (error) {
      await this.verifyError(error);
      response = await this.betFairAdapter.listMarketOdds(marketId);
    }
    return response;
  }

  private async verifyError(error: any) {
    const { errorCode } = error.message.detail.APINGException;
    if (errorCode === "INVALID_SESSION_INFORMATION") {
      return await this.betFairAdapter.login();
    }
    console.log(`BETFAIR PROXY: ${error.message}`);
    throw new HttpError(error.message.status, error.message.detail);
  }
}
