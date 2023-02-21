import { StartCustomStrategy } from "../../../src/application/usecases/start-custom-strategy";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

test("It should emit a over 0.5 HT started event", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const sut = new StartCustomStrategy(brokerSpy);

  const input = { strategyId: "strategyId", playerId: "playerId", strategyString: "over-05-ht" };
  await sut.execute(input);

  expect(brokerSpy.events).toHaveLength(1);
});
