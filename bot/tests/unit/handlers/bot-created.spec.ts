import { BotCreatedHandler } from "../../../src/application/handlers/bot-created";
import { BotCreated } from "../../../src/domain/events/bot-created";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { FakeHttpClient } from "../../utils/mocks/fake-http-client";
import { TestScheduler } from "../../utils/mocks/test-scheduler";

test("It should start a execution with a bot", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const scheduler = new TestScheduler();
  const httpClient = new FakeHttpClient();
  httpClient.mockURL("http://bet:3001/matches/today/upcoming", {
    statusCode: 200,
    data: [
      { id: "1", name: "Real Madrid vs Barcelona", date: "2021-01-01T23:59:00.000Z" },
      { id: "2", name: "Roma vs PSG", date: "2021-01-01T23:59:00.000Z" },
      { id: "3", name: "Bayern de Munique vs Liverpool", date: "2021-01-01T23:59:00.000Z" },
    ],
  });
  for (const matchId of ["1", "2", "3"]) {
    httpClient.mockURL(`http://bet:3001/matches/${matchId}/markets`, {
      statusCode: 200,
      data: [{ name: "Over/Under 0.5 Goals" }],
    });
  }

  const event = new BotCreated({ botId: "botId", market: "Over/Under 0.5 Goals" });
  const sut = new BotCreatedHandler({ httpClient, broker: brokerSpy, scheduler });
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

test("It should not schedule a execution if match does not have the market", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const scheduler = new TestScheduler();
  const httpClient = new FakeHttpClient();
  httpClient.mockURL("http://bet:3001/matches/today/upcoming", {
    statusCode: 200,
    data: [
      { id: "1", name: "Real Madrid vs Barcelona", date: "2021-01-01T23:59:00.000Z" },
      { id: "2", name: "Roma vs PSG", date: "2021-01-01T23:59:00.000Z" },
      { id: "3", name: "Bayern de Munique vs Liverpool", date: "2021-01-01T23:59:00.000Z" },
    ],
  });
  for (const matchId of ["1", "2", "3"]) {
    httpClient.mockURL(`http://bet:3001/matches/${matchId}/markets`, {
      statusCode: 200,
      data: [],
    });
  }

  const event = new BotCreated({ botId: "botId", market: "Over/Under 0.5 Goals" });
  const sut = new BotCreatedHandler({ httpClient, broker: brokerSpy, scheduler });
  await sut.handle(event);

  expect(brokerSpy.scheduledCommands).toHaveLength(0);
});
