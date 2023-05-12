import { ExecutionStartedHandler } from "../../../src/application/handlers/execution-started";
import { ExecutionStarted } from "../../../src/domain/events/execution-started";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { FakeHttpClient } from "../../utils/mocks/fake-http-client";
import { TestScheduler } from "../../utils/mocks/test-scheduler";

test("It should start a execution with a strategy", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const scheduler = new TestScheduler();
  const httpClient = new FakeHttpClient();
  httpClient.mockGet({
    statusCode: 200,
    data: [
      { id: "1", name: "Real Madrid vs Barcelona", date: "2021-01-01T23:59:00.000Z" },
      { id: "2", name: "Roma vs PSG", date: "2021-01-01T23:59:00.000Z" },
      { id: "3", name: "Bayern de Munique vs Liverpool", date: "2021-01-01T23:59:00.000Z" },
    ],
  });

  const event = new ExecutionStarted({ strategyId: "strategyId", market: "Over/Under 0.5 Goals" });
  const sut = new ExecutionStartedHandler({ httpClient, broker: brokerSpy, scheduler });
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
