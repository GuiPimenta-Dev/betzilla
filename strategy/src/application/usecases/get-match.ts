import { MatchRepository } from "../ports/repositories/match";

type Dependencies = {
  matchRepository: MatchRepository;
};

export class GetMatch {
  matchRepository: MatchRepository;

  constructor(input: Dependencies) {
    this.matchRepository = input.matchRepository;
  }

  async execute(matchId: string) {
    return await this.matchRepository.findById(matchId);
  }
}
