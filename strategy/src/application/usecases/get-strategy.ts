import { StrategyRepository } from "../ports/repositories/strategy";

type Dependencies = {
  strategyRepository: StrategyRepository;
};

export class GetStrategy {
  strategyRepository: StrategyRepository;

  constructor(input: Dependencies) {
    this.strategyRepository = input.strategyRepository;
  }

  async execute(strategyId: string) {
    return await this.strategyRepository.findById(strategyId);
  }
}
