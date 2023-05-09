import { Condition, Strategy } from "../../../src/domain/entities/strategy";

export class StrategyBuilder {
  conditions: Condition[] = [];

  static aStrategy(): StrategyBuilder {
    return new StrategyBuilder();
  }

  withConditions(conditions: Condition[]): StrategyBuilder {
    this.conditions = conditions;
    return this;
  }

  build(): Strategy {
    return new Strategy({
      id: "strategyId",
      playerId: "playerId",
      market: "market",
      type: "back",
      betValue: 10,
      conditions: this.conditions,
    });
  }
}
