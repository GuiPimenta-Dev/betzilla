import { CustomStrategy, StrategyRepository } from "../../application/ports/repositories/strategy";

export class InMemoryStrategyRepository implements StrategyRepository {
  private strategies: CustomStrategy[] = [];

  async create(input: CustomStrategy): Promise<void> {
    this.strategies.push(input);
  }
}
