import { OddsVerifiedHandler } from "../../../src/application/handlers/odds-verified";
import { OddsVerified } from "../../../src/domain/events/odds-verified";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMatchRepository } from "../../../src/infra/repositories/in-memory-match";
import { InMemoryStrategyRepository } from "../../../src/infra/repositories/in-memory-strategy";
import { MatchBuilder } from "../../utils/builders/match";
import { StrategyBuilder } from "../../utils/builders/strategy";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

test("It should bet if the odds are verified and match the criterion", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const strategyRepository = new InMemoryStrategyRepository();
  const matchRepository = new InMemoryMatchRepository();
  const conditions = [{ name: "IS_HALF_TIME" }];
  const strategy = StrategyBuilder.aStrategy().withConditions(conditions).build();
  const match = MatchBuilder.aMatch().build();
  await strategyRepository.create(strategy);
  await matchRepository.create(match);

  const sut = new OddsVerifiedHandler({ strategyRepository, matchRepository, broker: brokerSpy });
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
    type: "back",
    marketId: "market",
    matchId: "matchId",
  });
  expect(brokerSpy.history).toEqual(["make-bet"]);
});

test("It should not schedule a new verifyOdds if game is already over", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const strategyRepository = new InMemoryStrategyRepository();
  const matchRepository = new InMemoryMatchRepository();
  matchRepository.create(MatchBuilder.aFinishedMatch().build());

  const sut = new OddsVerifiedHandler({ matchRepository, strategyRepository, broker: brokerSpy });
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
  const strategyRepository = new InMemoryStrategyRepository();
  const matchRepository = new InMemoryMatchRepository();
  const conditions = [{ name: "IS_FULL_TIME" }];
  const strategy = StrategyBuilder.aStrategy().withConditions(conditions).build();
  const match = MatchBuilder.aMatch().build();
  await strategyRepository.create(strategy);
  await matchRepository.create(match);

  const sut = new OddsVerifiedHandler({ matchRepository, strategyRepository, broker: brokerSpy });
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
