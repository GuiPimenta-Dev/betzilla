import { ExecutionStartedHandler } from "../../../src/application/handlers/execution-started";
import { ExecutionStarted } from "../../../src/domain/events/execution-started";
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

  const input = { id: "id", playerId: "playerId", string: "over-05-ht", value: 10 };
  const event = new ExecutionStarted(input);
  const sut = new ExecutionStartedHandler({ httpClient, broker: brokerSpy });
  await sut.handle(event);

  expect(brokerSpy.scheduledCommands).toHaveLength(9);
  expect(brokerSpy.history).toEqual([
    "match-started",
    "half-time-finished",
    "match-finished",
    "match-started",
    "half-time-finished",
    "match-finished",
    "match-started",
    "half-time-finished",
    "match-finished",
  ]);
});
