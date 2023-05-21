import { AnalyticsRepository, BotAnalytics } from "../ports/repositories/analytics";

import { Bet } from "../../domain/entities/Bet";
import { HttpClient } from "../ports/http/http-client";

type Dependencies = {
  analyticsRepository: AnalyticsRepository;
  httpClient: HttpClient;
};

export class GetBotAnalytics {
  analyticsRepository: AnalyticsRepository;
  httpClient: HttpClient;

  constructor(input: Dependencies) {
    this.analyticsRepository = input.analyticsRepository;
    this.httpClient = input.httpClient;
  }

  async execute(botId: string): Promise<Output> {
    const { data: bot } = await this.httpClient.get(`http://bot:3002/bots/${botId}`);
    const history = await this.analyticsRepository.listAllByBotId(botId);
    const analytics = await this.analyticsRepository.getAnalyticsByBotId(botId);
    return { bot, analytics, history };
  }
}

type Bot = {
  id: string;
  playerId: string;
  market: string;
  type: string;
  betValue: number;
  conditions: { name: string; value?: number }[];
};

type Output = {
  bot: Bot;
  analytics: BotAnalytics;
  history: Bet[];
};
