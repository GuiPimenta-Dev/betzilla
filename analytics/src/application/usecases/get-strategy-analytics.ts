import { AnalyticsRepository, StrategyAnalytics } from "../ports/repositories/analytics";

import { Bet } from "../../domain/entities/Bet";
import { HttpClient } from "../ports/http/http-client";

type Dependencies = {
  analyticsRepository: AnalyticsRepository;
  httpClient: HttpClient;
};

export class GetStrategyAnalytics {
  analyticsRepository: AnalyticsRepository;
  httpClient: HttpClient;

  constructor(input: Dependencies) {
    this.analyticsRepository = input.analyticsRepository;
    this.httpClient = input.httpClient;
  }

  async execute(strategyId: string): Promise<Output> {
    const { data: strategy } = await this.httpClient.get(`http://strategy:3002/strategies/${strategyId}`);
    const history = await this.analyticsRepository.listAllByStrategyId(strategyId);
    const analytics = await this.analyticsRepository.getAnalyticsByStrategyId(strategyId);
    return { strategy, analytics, history };
  }
}

type Strategy = {
  id: string;
  playerId: string;
  market: string;
  type: string;
  betValue: number;
  conditions: { name: string; value?: number }[];
};

type Output = {
  strategy: Strategy;
  analytics: StrategyAnalytics;
  history: Bet[];
};
