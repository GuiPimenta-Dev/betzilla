import { MatchStarted } from "../../domain/events/match-started";
import { MatchRepository } from "../ports/repositories/match";
import { Handler } from "./handler";

type Dependencies = {
  matchRepository: MatchRepository;
};

export class HalfTimeFinishedHandler implements Handler {
  name = "half-time-finished";
  private matchRepository: MatchRepository;

  constructor(input: Dependencies) {
    this.matchRepository = input.matchRepository;
  }

  async handle(event: MatchStarted): Promise<void> {
    const match = await this.matchRepository.findById(event.payload.matchId);
    match.finishHalfTime();
    await this.matchRepository.update(match);
  }
}
