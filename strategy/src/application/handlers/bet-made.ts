import { BetMade } from "../../domain/events/bet-made";
import { MatchRepository } from "../ports/repositories/match";
import { Handler } from "./handler";

type Dependencies = {
  matchRepository: MatchRepository;
};

export class BetMadeHandler implements Handler {
  name = "bet-made";
  private matchRepository: MatchRepository;

  constructor(input: Dependencies) {
    this.matchRepository = input.matchRepository;
  }

  async handle(event: BetMade): Promise<void> {
    const { matchId, betId } = event.payload;
    const match = await this.matchRepository.findById(matchId);
    match.makeBet(betId);
    await this.matchRepository.update(match);
  }
}
