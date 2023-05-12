import { MatchStartedHandler } from "../../../src/application/handlers/match-started";
import { MatchStarted } from "../../../src/domain/events/match-started";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMatchRepository } from "../../../src/infra/repositories/in-memory-match";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { FakeHttpClient } from "../../utils/mocks/fake-http-client";

test("It should publish a message to verify odds after match started", async () => {
  const matchRepository = new InMemoryMatchRepository();
  const httpClient = new FakeHttpClient();
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  httpClient.mockGet({ statusCode: 200, data: [] });

  const sut = new MatchStartedHandler({ matchRepository, httpClient, broker: brokerSpy });
  const event = new MatchStarted({
    matchId: "matchId",
    name: "Real Madrid X Barcelona",
    date: "2021-01-01T00:00:00.000Z",
    strategyId: "strategyId",
    market: "Over/Under 0.5 Goals",
  });
  await sut.handle(event);

  expect(brokerSpy.scheduledCommands).toHaveLength(1);
  expect(brokerSpy.history).toEqual(["verify-odds"]);
});

test("It should start a match and change the status to half-time", async () => {
  const matchRepository = new InMemoryMatchRepository();
  const httpClient = new FakeHttpClient();
  const broker = new InMemoryBroker();
  httpClient.mockGet({
    statusCode: 200,
    data: [
      {
        id: "1.213876181",
        name: "Over/Under 0.5 Goals",
        odds: [],
      },
      {
        id: "1.213876105",
        name: "Over/Under 6.5 Goals",
        odds: [],
      },
    ],
  });

  const sut = new MatchStartedHandler({ matchRepository, httpClient, broker });
  const event = new MatchStarted({
    matchId: "matchId",
    name: "Real Madrid X Barcelona",
    date: "2021-01-01T00:00:00.000Z",
    strategyId: "strategyId",
    market: "Over/Under 0.5 Goals",
  });
  await sut.handle(event);

  const match = await matchRepository.findById("matchId");
  expect(match).toBeDefined();
  expect(match.status).toBe("half-time");
  expect(match.markets).toHaveLength(2);
});
