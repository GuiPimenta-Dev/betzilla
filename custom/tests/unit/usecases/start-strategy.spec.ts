import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryStrategyRepository } from "../../../src/infra/repositories/in-memory-strategy";
import { StartOver05HT } from "../../../src/application/usecases/start-over-05-ht";

test("It should emit a over 0.5 HT started event", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const strategyRepository = new InMemoryStrategyRepository();
  const sut = new StartOver05HT({ broker: brokerSpy, strategyRepository });

  const input = { id: "id", playerId: "playerId", value: 10 };
  await sut.execute(input);

  expect(brokerSpy.events).toHaveLength(1);
});

test("It should create a over 0.5 HT strategy", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const strategyRepository = new InMemoryStrategyRepository();
  const sut = new StartOver05HT({ broker: brokerSpy, strategyRepository });

  const input = { playerId: "playerId", value: 10 };
  const { strategyId } = await sut.execute(input);

  expect(await strategyRepository.findById(strategyId)).toEqual({
    id: strategyId,
    playerId: "playerId",
    name: "over-05-ht",
    value: 10,
  });
});
