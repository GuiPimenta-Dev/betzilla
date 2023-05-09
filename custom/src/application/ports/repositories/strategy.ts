import { Strategy } from "../../../domain/entities/strategy";

export interface StrategyRepository {
  create(input: Strategy): Promise<void>;
  findById(id: string): Promise<Strategy>;
}
