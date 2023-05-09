import { StrategyRepository } from "../../application/ports/repositories/strategy";
import { Strategy } from "../../domain/entities/strategy";

export class InMemoryStrategyRepository implements StrategyRepository {
  private strategies: Strategy[] = [];

  async create(input: Strategy): Promise<void> {
    this.strategies.push(input);
  }

  async findById(id: string): Promise<Strategy> {
    return this.strategies.find((strategy) => strategy.id === id);
  }
}
