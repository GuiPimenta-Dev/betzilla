import { Bet, BetGateway, BetStatus, Market, Match, MatchResult, Odd } from "../../application/ports/gateways/bet";

import { v4 as uuid } from "uuid";
import { HttpClient } from "../../application/ports/http/http-client";
import { MarketFactory } from "../../domain/entities/markets/factory";

export class FotMobAdapter implements BetGateway {
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
    const { data } = await this.httpClient.get(`${this.BASE_URL}/matchDetails`, { matchId });

    const { events } = data.content.matchFacts.events;
    let half = "ht";

    const result = {
      ht: { home: 0, away: 0 },
      ft: { home: 0, away: 0 },
    };

    for (const event of events) {
      if (event.type === "Half") half = "ft";
      if (event.type === "Goal") {
        if (event.isHome) result[half].home++;
        else result[half].away++;
      }
    }

    return {
      goals: result,
    };
  }

  async listMatchesForToday(): Promise<Match[]> {
    const { data } = await this.httpClient.get(`${this.BASE_URL}/matches`);
    const { leagues } = data;

    const result = [];
    for (const league of leagues) {
      const { matches } = league;
      for (const match of matches) {
        const leagueId = match.leagueId.toString();
        const id = match.id.toString();
        const name = `${match.home.longName} X ${match.away.longName}`;
        const date = match.status.utcTime;

        result.push({ leagueId, id, name, date });
      }
    }

    return result;
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
