import { MatchRepository } from "../../application/ports/repositories/match";
import { Match } from "../../domain/entities/match";

export class InMemoryMatchRepository implements MatchRepository {
  private strategies: Match[] = [];

  async create(input: Match): Promise<void> {
    this.strategies.push(input);
  }

  async findById(id: string): Promise<Match> {
    return this.strategies.find((match) => match.id === id);
  }
}
