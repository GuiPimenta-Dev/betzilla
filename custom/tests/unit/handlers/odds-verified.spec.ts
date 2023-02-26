import { OddsVerifiedHandler } from "../../../src/application/handlers/odds-verified";
import { StrategyName } from "../../../src/application/ports/repositories/strategy";
import { OddsVerified } from "../../../src/domain/events/odds-verified";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMatchRepository } from "../../../src/infra/repositories/in-memory-match";
import { InMemoryStrategyRepository } from "../../../src/infra/repositories/in-memory-strategy";
import { MatchBuilder } from "../../utils/builders/match";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

test("It should bet if the odds are verified and match the criterion and schedule a verify bet command", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const strategyRepository = new InMemoryStrategyRepository();
  const matchRepository = new InMemoryMatchRepository();
  await strategyRepository.create({ id: "strategyId", playerId: "playerId", name: StrategyName.OVER_05_HT, value: 10 });
  await matchRepository.create(MatchBuilder.aInProgress().build());

  const sut = new OddsVerifiedHandler({ strategyRepository, matchRepository, broker: brokerSpy });
  const event = new OddsVerified({
    match: { id: "matchId", name: StrategyName.OVER_05_HT },
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
  expect(brokerSpy.history).toEqual(["make-bet"]);
});

test("It should not schedule a new verifyOdds if game is already over", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const strategyRepository = new InMemoryStrategyRepository();
  const matchRepository = new InMemoryMatchRepository();
  matchRepository.create(MatchBuilder.aFinished().build());

  const sut = new OddsVerifiedHandler({ matchRepository, strategyRepository, broker: brokerSpy });
  const event = new OddsVerified({
    match: { id: "matchId", name: StrategyName.OVER_05_HT },
    odds: [],
  });
  await sut.handle(event);

  expect(brokerSpy.commands).toHaveLength(0);
  expect(brokerSpy.history).toEqual([]);
});
