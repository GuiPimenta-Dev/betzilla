import { MatchStarted } from "../../domain/events/match-started";
import { MatchRepository } from "../ports/repositories/match";
import { Handler } from "./handler";

type Dependencies = {
  matchRepository: MatchRepository;
};

export class MatchStartedHandler implements Handler {
  name = "match-started";
  private matchRepository: MatchRepository;

  constructor(input: Dependencies) {
    this.matchRepository = input.matchRepository;
  }

  async handle(event: MatchStarted): Promise<void> {
    const match = await this.matchRepository.findById(event.payload.matchId);
    match.start();
    await this.matchRepository.update(match);
  }
}
