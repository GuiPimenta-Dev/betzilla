import { CustomStrategy, StrategyRepository } from "../ports/repositories/strategy";

import { CustomStrategyStarted } from "../../domain/events/custom-strategy-started";
import { Broker } from "../ports/brokers/broker";

type Dependencies = {
  strategyRepository: StrategyRepository;
  broker: Broker;
};

export class StartCustomStrategy {
  private strategyRepository: StrategyRepository;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.strategyRepository = input.strategyRepository;
    this.broker = input.broker;
  }

  async execute(input: CustomStrategy): Promise<void> {
    await this.strategyRepository.create(input);
    await this.broker.publish(new CustomStrategyStarted(input));
  }
}
