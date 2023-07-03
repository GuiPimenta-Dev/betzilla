import { Bet, BetGateway, BetStatus, Market, Match, MatchResult, Odd } from "../../application/ports/gateways/bet";

import moment from "moment";
import { v4 as uuid } from "uuid";
import { HttpClient } from "../../application/ports/http/http-client";
import { MarketFactory } from "../../domain/entities/markets/factory";

export class DevFotMobAdapter implements BetGateway {
  bet: number;

  BASE_URL = "https://www.fotmob.com/api";

  constructor(private httpClient: HttpClient) {}

  async login(): Promise<void> {}

  async makeBet(input: Bet): Promise<{ success: boolean; betId: string }> {
    this.bet = input.betValue;
    return { success: true, betId: uuid() };
  }

  async consultBet(matchId: string, marketId: number): Promise<BetStatus> {
    const data = await this.consultMatch(matchId);
    const market = new MarketFactory().getMarket(marketId);
    const result = market.consult(data);
    if (result) return { status: "won", outcome: this.bet * 2 };
    return { status: "lost", outcome: 0 };
  }

  private async consultMatch(matchId: string): Promise<MatchResult> {
    const result = {
      ht: { home: 0, away: 0 },
      ft: { home: 0, away: 0 },
    };

    const getRandomNumber = (): number => {
      const randomNumber = Math.floor(Math.random() * 11);
      return randomNumber >= 3 ? 0 : randomNumber;
    };

    result.ht.home = getRandomNumber();
    result.ht.away = getRandomNumber();
    result.ft.home = getRandomNumber();
    result.ft.away = getRandomNumber();

    console.log(result);

    return {
      goals: result,
    };
  }

  async listMatchesForToday(): Promise<Match[]> {
    return [
      {
        leagueId: "881951",
        id: uuid(),
        name: "Newell's Old Boys X Gimnasia LP",
        date: moment().add(1, "second").toISOString(),
      },
    ];
  }

  async listMatchMarkets(): Promise<Market[]> {
    const result = [];

    const marketFactory = new MarketFactory();
    for (const market in marketFactory.markets) {
      result.push({
        id: market,
        name: marketFactory.markets[market].name,
      });
    }

    return result;
  }

  async listMarketOdds(): Promise<Odd[]> {
    return [
      {
        id: uuid(),
        back: [2],
        lay: [2],
      },
    ];
  }
}
