import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { FakeHttpClient } from "../../utils/mocks/fake-http-client";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMatchRepository } from "../../../src/infra/repositories/in-memory-match";
import { StrategyName } from "../../../src/application/ports/repositories/strategy";
import { StrategyStarted } from "../../../src/domain/events/strategy-started";
import { StrategyStartedHandler } from "../../../src/application/handlers/strategy-started";

test("It should start a custom strategy", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const matchRepository = new InMemoryMatchRepository();
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
  const sut = new StrategyStartedHandler({ matchRepository, httpClient, broker: brokerSpy });
  await sut.handle(event);

  expect(brokerSpy.scheduledCommands).toHaveLength(12);
  expect(brokerSpy.history).toEqual([
    "verify-odds",
    "match-started",
    "half-time-finished",
    "match-finished",
    "verify-odds",
    "match-started",
    "half-time-finished",
    "match-finished",
    "verify-odds",
    "match-started",
    "half-time-finished",
    "match-finished",
  ]);
});

test("It should create the matches in match repository", async () => {
  const broker = new InMemoryBroker();
  const matchRepository = new InMemoryMatchRepository();
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
  const sut = new StrategyStartedHandler({ matchRepository, httpClient, broker });
  await sut.handle(event);

  const match1 = await matchRepository.findById("1");
  const match2 = await matchRepository.findById("2");
  const match3 = await matchRepository.findById("3");
  expect(match1).toBeDefined();
  expect(match2).toBeDefined();
  expect(match3).toBeDefined();
});
