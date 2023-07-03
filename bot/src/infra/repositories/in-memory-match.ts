import { MatchRepository } from "../../application/ports/repositories/match";
import { Match } from "../../domain/entities/match";

export class InMemoryMatchRepository implements MatchRepository {
  private matches: Match[] = [];

  async create(input: Match): Promise<void> {
    this.matches.push(input);
  }

  async list(): Promise<Match[]> {
    return this.matches;
  }

  async findById(id: string): Promise<Match> {
    return this.matches.find((match) => match.id === id);
  }

  async update(input: Match): Promise<void> {
    const index = this.matches.findIndex((match) => match.id === input.id);
    this.matches[index] = input;
  }
}
