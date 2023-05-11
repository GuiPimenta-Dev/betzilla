import { BetGateway, Odd } from "../ports/gateways/bet";

type Dependencies = {
  betGateway: BetGateway;
};

type Output = {
  id: string;
  name: string;
  odds: Odd[];
};

export class ListMatchMarkets {
  private betGateway: BetGateway;

  constructor(input: Dependencies) {
    this.betGateway = input.betGateway;
  }

  async execute(matchId: string): Promise<Output[]> {
    const markets = await this.betGateway.listMatchMarkets(matchId);
    const result = await Promise.all(
      markets.map(async (market) => {
        const odds = await this.betGateway.listMarketOdds(market.id);
        return { ...market, odds };
      })
    );
    return result;
  }
}
