import { OddsVerifiedHandler } from "../../../src/application/handlers/odds-verified";
import { StrategyName } from "../../../src/application/ports/repositories/strategy";
import { OddsVerified } from "../../../src/domain/events/odds-verified";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryStrategyRepository } from "../../../src/infra/repositories/in-memory-strategy";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

test("It should bet if the odds are verified and match the criterion and schedule a verify bet command", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const strategyRepository = new InMemoryStrategyRepository();
  await strategyRepository.create({ id: "id", playerId: "playerId", name: StrategyName.OVER_05_HT, value: 10 });

  const sut = new OddsVerifiedHandler({ strategyRepository, broker: brokerSpy });
  const event = new OddsVerified({
    match: { id: "matchId", name: StrategyName.OVER_05_HT },
    strategyId: "id",
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
