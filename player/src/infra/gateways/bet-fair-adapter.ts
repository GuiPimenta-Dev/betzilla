import { BetGateway, BetStatus, Market, Match, Odd } from "../../application/ports/gateways/bet";

import moment from "moment";
import { HttpClient } from "../../application/ports/http/http-client";

export class BetFairAdapter implements BetGateway {
  BASE_URL = "https://api.betfair.com/exchange/betting/rest/v1.0";

  TOKEN: string;

  constructor(private httpClient: HttpClient) {}

  async login(): Promise<void> {
    const { data } = await this.httpClient.post(
      "https://identitysso.betfair.com/api/login",
      {
        username: process.env.BETFAIR_USERNAME,
        password: process.env.BETFAIR_PASSWORD,
      },
      {
        Accept: "application/json",
        "X-Application": process.env.BETFAIR_APP_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      }
    );
    this.TOKEN = data.token;
  }

  async makeBet(value: number): Promise<{ success: boolean }> {
    return { success: true };
  }

  async consultBet(id: string): Promise<BetStatus> {
    throw new Error("Method not implemented.");
  }

  async listMatchesForToday(): Promise<Match[]> {
    const from = moment();
    const to = moment().add(1, "day");
    const body = {
      filter: {
        eventTypeIds: ["1"],
        marketStartTime: {
          from: `${from.format("YYYY-MM-DD")}T00:00:00.000Z`,
          to: `${to.format("YYYY-MM-DD")}T00:00:00.000Z`,
        },
      },
      locale: "pt",
    };
    const { data } = await this.httpClient.post(`${this.BASE_URL}/listEvents/`, body, {
      "X-Authentication": this.TOKEN,
      "X-Application": process.env.BETFAIR_APP_KEY,
      "Content-Type": "application/json",
    });

    const matches = data.map((match: any) => {
      return {
        id: match.event.id,
        name: match.event.name,
        date: match.event.openDate,
      };
    });
    return matches;
  }

  async listMatchMarkets(matchId: string): Promise<Market[]> {
    const { data } = await this.httpClient.post(
      `${this.BASE_URL}/listMarketCatalogue/`,
      {
        filter: {
          eventTypeIds: [1],
          eventIds: [matchId],
        },
        sort: "FIRST_TO_START",
        maxResults: 100,
        locale: "pt",
      },
      {
        "X-Authentication": this.TOKEN,
        "X-Application": process.env.BETFAIR_APP_KEY,
        "Content-Type": "application/json",
      }
    );

    const markets = data.map((market: any) => {
      return {
        id: market.marketId,
        name: market.marketName,
      };
    });

    return markets;
  }

  async listMarketOdds(marketId: string): Promise<Odd> {
    const { data } = await this.httpClient.post(
      `${this.BASE_URL}/listMarketBook/`,
      {
        marketIds: [marketId],
        priceProjection: {
          priceData: ["EX_BEST_OFFERS"],
        },
        locale: "pt",
      },
      {
        "X-Authentication": this.TOKEN,
        "X-Application": process.env.BETFAIR_APP_KEY,
        "Content-Type": "application/json",
      }
    );

    const odds = data[0].runners.map((runner: any) => {
      const maxLength = Math.max(runner.ex.availableToBack.length, runner.ex.availableToLay.length);

      let back = [];
      let lay = [];

      for (let i = 0; i < maxLength; i++) {
        back.push(runner.ex.availableToBack[i]?.price || 0);
        lay.push(runner.ex.availableToLay[i]?.price || 0);
      }

      return {
        id: runner.selectionId,
        status: runner.status,
        back,
        lay,
      };
    });

    return {
      status: data[0].status,
      odds,
    };
  }
}
