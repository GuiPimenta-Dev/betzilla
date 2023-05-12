import { BetLost } from "../../domain/events/bet-lost";
import { AnalyticsRepository } from "../ports/repositories/analytics";
import { Handler } from "./handler";

type Dependencies = {
  analyticsRepository: AnalyticsRepository;
};

export class BetLostHandler implements Handler {
  name = "bet-lost";
  private analyticsRepository: AnalyticsRepository;

  constructor(input: Dependencies) {
    this.analyticsRepository = input.analyticsRepository;
  }

  async handle(event: BetLost): Promise<void> {
    const { matchId } = event.payload;
    const match = await this.analyticsRepository.findByMatchId(matchId);
    match.status = "lost";
    match.credit = 0;
    match.profit = -match.debit;
    await this.analyticsRepository.update(match);
  }
}
