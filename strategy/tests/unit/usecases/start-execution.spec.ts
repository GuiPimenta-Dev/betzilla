import { StartExecution } from "../../../src/application/usecases/start-execution";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryStrategyRepository } from "../../../src/infra/repositories/in-memory-strategy";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

test("It should emit a over 0.5 HT started event", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const strategyRepository = new InMemoryStrategyRepository();
  const sut = new StartExecution({ broker: brokerSpy, strategyRepository });

  const strategy = {
    market: "OVER_UNDER_05",
    type: "back",
    betValue: 10,
    conditions: [
      {
        name: "IS_AFTER_MINUTE",
        value: 15,
      },
      {
        name: "IS_ODD_ABOVE",
        value: 1.5,
      },
      {
        name: "IS_HALF_TIME",
      },
    ],
  };
  const input = { strategy, playerId: "playerId" };
  await sut.execute(input);

  expect(brokerSpy.events).toHaveLength(1);
});

test("It should create a strategy", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const strategyRepository = new InMemoryStrategyRepository();
  const sut = new StartExecution({ broker: brokerSpy, strategyRepository });

  const strategy = {
    market: "OVER_UNDER_05",
    type: "back",
    betValue: 10,
    conditions: [
      {
        name: "IS_AFTER_MINUTE",
        value: 15,
      },
      {
        name: "IS_ODD_ABOVE",
        value: 1.5,
      },
      {
        name: "IS_HALF_TIME",
      },
    ],
  };
  const input = { strategy, playerId: "playerId" };
  const { strategyId } = await sut.execute(input);

  const _strategy = await strategyRepository.findById(strategyId);
  expect(_strategy.id).toBe(strategyId);
  expect(_strategy.betValue).toBe(10);
  expect(_strategy.conditions).toHaveLength(3);
});
