import { StrategyStartedHandler } from "../../../src/application/handlers/strategy-started";
import { StrategyName } from "../../../src/application/ports/repositories/strategy";
import { StrategyStarted } from "../../../src/domain/events/strategy-started";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { FakeHttpClient } from "../../utils/mocks/fake-http-client";

test("It should start a custom strategy", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const httpClient = new FakeHttpClient();
  httpClient.mockGetResponse({
    statusCode: 200,
    data: [
      { id: "1", name: "Real Madrid vs Barcelona", date: "2021-01-01T23:59:00.000Z" },
      { id: "2", name: "Roma vs PSG", date: "2021-01-01T23:59:00.000Z" },
      { id: "3", name: "Bayern de Munique vs Liverpool", date: "2021-01-01T23:59:00.000Z" },
    ],
  });

  const input = { id: "id", playerId: "playerId", name: StrategyName.OVER_05_HT, value: 10 };
  const event = new StrategyStarted(input);
  const sut = new StrategyStartedHandler({ httpClient, broker: brokerSpy });
  await sut.handle(event);

  expect(brokerSpy.scheduledCommands).toHaveLength(3);
  expect(brokerSpy.history).toEqual(["verify-odds", "verify-odds", "verify-odds"]);
});
