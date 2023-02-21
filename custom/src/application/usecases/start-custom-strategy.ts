import { CustomStrategyStarted } from "../../domain/events/custom-strategy-started";
import { Broker } from "../ports/brokers/broker";

type Input = {
  strategyId: string;
  playerId: string;
  strategyString: string;
};

export class StartCustomStrategy {
  constructor(private broker: Broker) {}

  async execute(input: Input): Promise<void> {
    await this.broker.publish(new CustomStrategyStarted(input));
  }
}
