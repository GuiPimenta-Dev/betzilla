import { MatchStartedHandler } from "../../../src/application/handlers/match-started";
import { MatchStarted } from "../../../src/domain/events/match-started";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMatchRepository } from "../../../src/infra/repositories/in-memory-match";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

test("It should publish a message to verify odds after match started", async () => {
  const matchRepository = new InMemoryMatchRepository();
  const brokerSpy = new BrokerSpy(new InMemoryBroker());

  const sut = new MatchStartedHandler({ matchRepository, broker: brokerSpy });
  const event = new MatchStarted({
    matchId: "matchId",
    name: "Real Madrid X Barcelona",
    date: "2021-01-01T00:00:00.000Z",
    botId: "botId",
    market: "Over/Under 0.5 Goals",
  });
  await sut.handle(event);

  expect(brokerSpy.scheduledCommands).toHaveLength(1);
  expect(brokerSpy.history).toEqual(["verify-odds"]);
});

test("It should start a match and change the status to half-time", async () => {
  const matchRepository = new InMemoryMatchRepository();
  const broker = new InMemoryBroker();

  const sut = new MatchStartedHandler({ matchRepository, broker });
  const event = new MatchStarted({
    matchId: "matchId",
    name: "Real Madrid X Barcelona",
    date: "2021-01-01T00:00:00.000Z",
    botId: "botId",
    market: "Over/Under 0.5 Goals",
  });
  await sut.handle(event);

  const match = await matchRepository.findById("matchId");
  expect(match).toBeDefined();
  expect(match.status).toBe("half-time");
});
