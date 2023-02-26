import { StrategyName, StrategyRepository } from "../ports/repositories/strategy";

import { StrategyStarted } from "../../domain/events/strategy-started";
import { Broker } from "../ports/brokers/broker";

type Dependencies = {
  strategyRepository: StrategyRepository;
  broker: Broker;
};

type Input = {
  id: string;
  playerId: string;
  value: number;
};

export class StartOver05HT {
  private strategyRepository: StrategyRepository;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.strategyRepository = input.strategyRepository;
    this.broker = input.broker;
  }

  async execute(input: Input): Promise<void> {
    const strategy = {
      id: input.id,
      playerId: input.playerId,
      name: StrategyName.OVER_05_HT,
      value: input.value,
    };
    await this.strategyRepository.create(strategy);
    await this.broker.publish(new StrategyStarted(strategy));
  }
}
