import { PEVOddsVerifiedHandler } from "../../../src/application/handlers/pev-odds-verified";
import { OddsVerified } from "../../../src/domain/events/odds-verified";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryBotRepository } from "../../../src/infra/repositories/in-memory-bot";
import { InMemoryMatchRepository } from "../../../src/infra/repositories/in-memory-match";
import { BotBuilder } from "../../utils/builders/bot";
import { MatchBuilder } from "../../utils/builders/match";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { FakeHttpClient } from "../../utils/mocks/fake-http-client";
import { TestScheduler } from "../../utils/mocks/test-scheduler";

test.skip("It should make a bet for the biggest odds for every market that has a positive ev", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const httpClient = new FakeHttpClient();
  const botRepository = new InMemoryBotRepository();
  const matchRepository = new InMemoryMatchRepository();
  const scheduler = new TestScheduler();
  const bot = BotBuilder.aPEV().build();
  const match = MatchBuilder.aMatch().build();
  await botRepository.create(bot);
  await matchRepository.create(match);
  httpClient.mockURL("http://bet:3001/matches/matchId/markets", {
    statusCode: 200,
    data: [{ id: "marketId", name: "Over/Under 0.5 Goals" }],
  });
  httpClient.mockURL("http://bet:3001/markets/marketId/odds", {
    statusCode: 200,
    data: [
      {
        id: "1",
        back: [1.5],
        lay: [1.29],
      },
      {
        id: "2",
        back: [2],
        lay: [14],
      },
      {
        id: "3",
        back: [1.8],
        lay: [6.8],
      },
    ],
  });

  const sut = new PEVOddsVerifiedHandler({ botRepository, httpClient, matchRepository, broker: brokerSpy, scheduler });
  const event = new OddsVerified({ matchId: "matchId", odds: [] });
  await sut.handle(event);

  expect(brokerSpy.commands).toHaveLength(1);
  expect(brokerSpy.history).toEqual(["make-bet", "verify-odds"]);
  expect(brokerSpy.commands[0].payload).toEqual({
    oddId: "2",
    playerId: "playerId",
    betValue: 10,
    odd: 14,
    side: "lay",
    marketId: 1,
    matchId: "matchId",
  });
});

test.skip("It should make a bet for every market that has a positive ev even if its more than one", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const httpClient = new FakeHttpClient();
  const botRepository = new InMemoryBotRepository();
  const matchRepository = new InMemoryMatchRepository();
  const scheduler = new TestScheduler();
  const bot = BotBuilder.aPEV().build();
  const match = MatchBuilder.aMatch().build();
  await botRepository.create(bot);
  await matchRepository.create(match);
  httpClient.mockURL("http://bet:3001/matches/matchId/markets", {
    statusCode: 200,
    data: [
      { id: "1", name: "Over/Under 0.5 Goals" },
      { id: "2", name: "Over/Under 2.5 Goals" },
    ],
  });
  for (const marketId of ["1", "2"]) {
    httpClient.mockURL(`http://bet:3001/markets/${marketId}/odds`, {
      statusCode: 200,
      data: [
        {
          id: "1",
          back: [1.5],
          lay: [1.29],
        },
        {
          id: "2",
          back: [2],
          lay: [14],
        },
        {
          id: "3",
          back: [1.8],
          lay: [6.8],
        },
      ],
    });
  }

  const sut = new PEVOddsVerifiedHandler({ botRepository, httpClient, matchRepository, broker: brokerSpy, scheduler });
  const event = new OddsVerified({ matchId: "matchId", odds: [] });
  await sut.handle(event);

  expect(brokerSpy.commands).toHaveLength(2);
  expect(brokerSpy.history).toEqual(["make-bet", "make-bet", "verify-odds"]);
});

test("It should not make any bet if any has positive ev", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const httpClient = new FakeHttpClient();
  const botRepository = new InMemoryBotRepository();
  const matchRepository = new InMemoryMatchRepository();
  const scheduler = new TestScheduler();
  const bot = BotBuilder.aPEV().build();
  const match = MatchBuilder.aMatch().build();
  await botRepository.create(bot);
  await matchRepository.create(match);
  httpClient.mockURL("http://bet:3001/matches/matchId/markets", {
    statusCode: 200,
    data: [{ id: "marketId", name: "Over/Under 0.5 Goals" }],
  });
  httpClient.mockURL("http://bet:3001/markets/marketId/odds", {
    statusCode: 200,
    data: [{ id: "1", back: [0], lay: [0] }],
  });

  const sut = new PEVOddsVerifiedHandler({ botRepository, httpClient, matchRepository, broker: brokerSpy, scheduler });
  const event = new OddsVerified({ matchId: "matchId", odds: [] });
  await sut.handle(event);

  expect(brokerSpy.commands).toHaveLength(0);
  expect(brokerSpy.history).toEqual(["verify-odds"]);
});

test("It should not emit any command if bot name is not pev", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const httpClient = new FakeHttpClient();
  const botRepository = new InMemoryBotRepository();
  const matchRepository = new InMemoryMatchRepository();
  const scheduler = new TestScheduler();
  const bot = BotBuilder.aBot().build();
  const match = MatchBuilder.aMatch().build();
  await botRepository.create(bot);
  await matchRepository.create(match);

  const sut = new PEVOddsVerifiedHandler({ botRepository, httpClient, matchRepository, broker: brokerSpy, scheduler });
  const event = new OddsVerified({ matchId: "matchId", odds: [] });
  await sut.handle(event);

  expect(brokerSpy.commands).toHaveLength(0);
});

test("It should not emit any command if match is finished", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const httpClient = new FakeHttpClient();
  const botRepository = new InMemoryBotRepository();
  const matchRepository = new InMemoryMatchRepository();
  const scheduler = new TestScheduler();
  const bot = BotBuilder.aPEV().build();
  const match = MatchBuilder.aFinishedMatch().build();
  await botRepository.create(bot);
  await matchRepository.create(match);

  const sut = new PEVOddsVerifiedHandler({ botRepository, httpClient, matchRepository, broker: brokerSpy, scheduler });
  const event = new OddsVerified({ matchId: "matchId", odds: [] });
  await sut.handle(event);

  expect(brokerSpy.commands).toHaveLength(0);
});
