import { MatchFinished } from "../../domain/events/match-finished";
import { MatchRepository } from "../ports/repositories/match";
import { Handler } from "./handler";

type Dependencies = {
  matchRepository: MatchRepository;
};

export class MatchFinishedHandler implements Handler {
  name = "match-finished";
  private matchRepository: MatchRepository;

  constructor(input: Dependencies) {
    this.matchRepository = input.matchRepository;
  }

  async handle(event: MatchFinished): Promise<void> {
    const match = await this.matchRepository.findById(event.payload.matchId);
    match.finish();
    await this.matchRepository.update(match);
  }
}
