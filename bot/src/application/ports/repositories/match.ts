import { Match } from "../../../domain/entities/match";

export interface MatchRepository {
  create(input: Match): Promise<void>;
  findById(id: string): Promise<Match>;
  update(input: Match): Promise<void>;
}
