import { OddsVerifiedHandler } from "../../../src/application/handlers/odds-verified";
import { OddsVerified } from "../../../src/domain/events/odds-verified";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryBotRepository } from "../../../src/infra/repositories/in-memory-bot";
import { InMemoryMatchRepository } from "../../../src/infra/repositories/in-memory-match";
import { BotBuilder } from "../../utils/builders/bot";
import { MatchBuilder } from "../../utils/builders/match";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { TestScheduler } from "../../utils/mocks/test-scheduler";

test("It should bet if the odds are verified and match the criterion", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const botRepository = new InMemoryBotRepository();
  const matchRepository = new InMemoryMatchRepository();
  const scheduler = new TestScheduler();
  const conditions = [{ name: "IS_HALF_TIME" }];
  const bot = BotBuilder.aPlayerRules().withConditions(conditions).build();
  const match = MatchBuilder.aMatch().build();
  await botRepository.create(bot);
  await matchRepository.create(match);

  const sut = new OddsVerifiedHandler({ botRepository, matchRepository, broker: brokerSpy, scheduler });
  const event = new OddsVerified({
    matchId: "matchId",
    odds: [
      {
        id: "1",
        back: [1.01, 1.89, 1.03],
        lay: [1.04, 1.05, 1.06],
      },
      {
        id: "2",
        back: [2.01, 2.02, 2.03],
        lay: [2.04, 2.05, 2.06],
      },
    ],
  });
  await sut.handle(event);

  expect(brokerSpy.commands).toHaveLength(1);
  expect(brokerSpy.commands[0].payload).toEqual({
    oddId: "2",
    playerId: "playerId",
    betValue: 10,
    odd: 2.03,
    side: "back",
    marketId: "market",
    matchId: "matchId",
  });
  expect(brokerSpy.history).toEqual(["make-bet"]);
});

test("It should not schedule a new verifyOdds if game is already over", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const botRepository = new InMemoryBotRepository();
  const scheduler = new TestScheduler();
  const matchRepository = new InMemoryMatchRepository();
  matchRepository.create(MatchBuilder.aFinishedMatch().build());

  const sut = new OddsVerifiedHandler({ matchRepository, botRepository, broker: brokerSpy, scheduler });
  const event = new OddsVerified({
    matchId: "matchId",
    odds: [],
  });
  await sut.handle(event);

  expect(brokerSpy.commands).toHaveLength(0);
  expect(brokerSpy.history).toEqual([]);
});

test("It should schedule a new verifyOdds if game is not over and if should not bet right now", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const botRepository = new InMemoryBotRepository();
  const matchRepository = new InMemoryMatchRepository();
  const scheduler = new TestScheduler();
  const conditions = [{ name: "IS_FULL_TIME" }];
  const bot = BotBuilder.aPlayerRules().withConditions(conditions).build();
  const match = MatchBuilder.aMatch().build();
  await botRepository.create(bot);
  await matchRepository.create(match);

  const sut = new OddsVerifiedHandler({ botRepository, matchRepository, broker: brokerSpy, scheduler });
  const event = new OddsVerified({
    matchId: "matchId",
    odds: [
      {
        id: "1",
        back: [1.01, 1.5, 1.03],
        lay: [1.04, 1.05, 1.06],
      },
    ],
  });
  await sut.handle(event);

  expect(brokerSpy.scheduledCommands).toHaveLength(1);
  expect(brokerSpy.history).toEqual(["verify-odds"]);
});
