import { v4 as uuid } from "uuid";
import { ExecutionStarted } from "../../domain/events/execution-started";
import { Broker } from "../ports/brokers/broker";
import { RuleRepository } from "../ports/repositories/rule";

type Dependencies = {
  ruleRepository: RuleRepository;
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

export class StartExecution {
  private ruleRepository: RuleRepository;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.ruleRepository = input.ruleRepository;
    this.broker = input.broker;
  }

  async execute(input: Input): Promise<Output> {
    const rule = { id: uuid(), playerId: input.playerId, string: input.rule, value: input.value };
    await this.ruleRepository.create(rule);
    await this.broker.publish(new ExecutionStarted(rule));
    return { ruleId: rule.id };
  }
}
