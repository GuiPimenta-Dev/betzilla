import { StrategyInfo, StrategyRepository } from "../../application/ports/repositories/strategy";

export class InMemoryStrategyRepository implements StrategyRepository {
  private strategies: StrategyInfo[] = [];

  async create(input: StrategyInfo): Promise<void> {
    this.strategies.push(input);
  }

  async findById(id: string): Promise<StrategyInfo> {
    return this.strategies.find((strategy) => strategy.id === id);
  }
}
