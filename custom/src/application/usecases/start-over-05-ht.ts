import { v4 as uuid } from "uuid";
import { ExecutionStarted } from "../../domain/events/execution-started";
import { Broker } from "../ports/brokers/broker";
import { Strategy } from "../ports/repositories/strategy";

type Dependencies = {
  strategyRepository: Strategy;
  broker: Broker;
};

type Input = {
  playerId: string;
  rule: string;
  value: number;
};

type Output = {
  ruleId: string;
};

export class StartOver05HT {
  private strategyRepository: Strategy;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.strategyRepository = input.strategyRepository;
    this.broker = input.broker;
  }

  async execute(input: Input): Promise<Output> {
    const rule = {
      id: uuid(),
      playerId: input.playerId,
      string: input.rule,
      value: input.value,
    };
    await this.strategyRepository.create(rule);
    await this.broker.publish(new ExecutionStarted(rule));
    return { ruleId: rule.id };
  }
}
