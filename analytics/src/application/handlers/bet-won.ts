import { BetWon } from "../../domain/events/bet-won";
import { AnalyticsRepository } from "../ports/repositories/analytics";
import { Handler } from "./handler";

type Dependencies = {
  analyticsRepository: AnalyticsRepository;
};

export class BetWonHandler implements Handler {
  name = "bet-won";
  private analyticsRepository: AnalyticsRepository;

  constructor(input: Dependencies) {
    this.analyticsRepository = input.analyticsRepository;
  }

  async handle(event: BetWon): Promise<void> {
    const { matchId, outcome } = event.payload;
    const match = await this.analyticsRepository.findByMatchId(matchId);
    match.status = "won";
    match.credit = outcome;
    match.profit = outcome - match.debit;
    await this.analyticsRepository.update(match);
  }
}
