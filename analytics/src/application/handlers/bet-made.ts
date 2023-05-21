import { Bet } from "../../domain/entities/Bet";
import { BetMade } from "../../domain/events/bet-made";
import { HttpClient } from "../ports/http/http-client";
import { AnalyticsRepository } from "../ports/repositories/analytics";
import { Handler } from "./handler";

type Dependencies = {
  analyticsRepository: AnalyticsRepository;
  httpClient: HttpClient;
};

export class BetMadeHandler implements Handler {
  name = "bet-made";
  private analyticsRepository: AnalyticsRepository;
  private httpClient: HttpClient;

  constructor(input: Dependencies) {
    this.analyticsRepository = input.analyticsRepository;
    this.httpClient = input.httpClient;
  }

  async handle(event: BetMade): Promise<void> {
    const { matchId, betValue } = event.payload;
    const { data } = await this.httpClient.get(`http://bot:3002/matches/${matchId}`);
    const match = new Bet({
      matchId,
      botId: data.botId,
      match: data.name,
      playerId: data.playerId,
      debit: betValue,
      credit: null,
      profit: null,
      status: "pending",
      timestamp: event.timestamp,
    });
    await this.analyticsRepository.create(match);
  }
}
