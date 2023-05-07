import { StrategyName, StrategyRepository } from "../ports/repositories/strategy";

import { Broker } from "../ports/brokers/broker";
import { StrategyStarted } from "../../domain/events/strategy-started";
import { v4 as uuid } from "uuid";

type Dependencies = {
  strategyRepository: StrategyRepository;
  broker: Broker;
};

type Input = {
  playerId: string;
  value: number;
};

type Output = {
  strategyId: string;
};

export class StartOver05HT {
  private strategyRepository: StrategyRepository;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.strategyRepository = input.strategyRepository;
    this.broker = input.broker;
  }

  async execute(input: Input): Promise<Output> {
    const strategy = {
      id: uuid(),
      playerId: input.playerId,
      name: StrategyName.OVER_05_HT,
      value: input.value,
    };
    await this.strategyRepository.create(strategy);
    await this.broker.publish(new StrategyStarted(strategy));
    return { strategyId: strategy.id };
  }
}
