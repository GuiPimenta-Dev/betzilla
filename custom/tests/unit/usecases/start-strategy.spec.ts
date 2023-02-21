import { StartCustomStrategy } from "../../../src/application/usecases/start-custom-strategy";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryStrategyRepository } from "../../../src/infra/repositories/in-memory-strategy";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

test("It should emit a over 0.5 HT started event", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const strategyRepository = new InMemoryStrategyRepository();
  const sut = new StartCustomStrategy(strategyRepository, brokerSpy);

  const input = { id: "id", playerId: "playerId", strategyString: "over-05-ht" };
  await sut.execute(input);

  expect(brokerSpy.events).toHaveLength(1);
});
