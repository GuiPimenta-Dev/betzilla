import { v4 as uuid } from "uuid";
import { ExecutionStarted } from "../../domain/events/execution-started";
import { Broker } from "../ports/brokers/broker";
import { StrategyRepository } from "../ports/repositories/strategy";

type Dependencies = {
  strategyRepository: StrategyRepository;
  broker: Broker;
};

type Condition = {
  name: string;
  value?: number;
};

type Strategy = {
  market: string;
  type: string;
  betValue: number;
  conditions: Condition[];
};

type Input = {
  strategy: Strategy;
  playerId: string;
};

type Output = {
  strategyId: string;
};

export class StartExecution {
  private strategyRepository: StrategyRepository;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.strategyRepository = input.strategyRepository;
    this.broker = input.broker;
  }

  async execute(input: Input): Promise<Output> {
    const strategy = { id: uuid(), playerId: input.playerId, ...input.strategy };
    await this.strategyRepository.create(strategy);
    await this.broker.publish(new ExecutionStarted(strategy));
    return { strategyId: strategy.id };
  }
}
