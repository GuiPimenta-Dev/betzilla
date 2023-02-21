import { CustomStrategy, StrategyRepository } from "../ports/repositories/strategy";

import { CustomStrategyStarted } from "../../domain/events/custom-strategy-started";
import { Broker } from "../ports/brokers/broker";

export class StartCustomStrategy {
  constructor(private customStrategyRepository: StrategyRepository, private broker: Broker) {}

  async execute(input: CustomStrategy): Promise<void> {
    await this.customStrategyRepository.create(input);
    await this.broker.publish(new CustomStrategyStarted(input));
  }
}
