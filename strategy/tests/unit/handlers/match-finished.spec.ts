import { MatchFinishedHandler } from "../../../src/application/handlers/match-finished";
import { MatchFinished } from "../../../src/domain/events/match-finished";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMatchRepository } from "../../../src/infra/repositories/in-memory-match";
import { InMemoryStrategyRepository } from "../../../src/infra/repositories/in-memory-strategy";
import { MatchBuilder } from "../../utils/builders/match";
import { StrategyBuilder } from "../../utils/builders/strategy";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { TestScheduler } from "../../utils/mocks/test-scheduler";

test("It should schedule a verifyBet if bet was made in this match", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const strategyRepository = new InMemoryStrategyRepository();
  const matchRepository = new InMemoryMatchRepository();
  const scheduler = new TestScheduler();
  const strategy = StrategyBuilder.aStrategy().build();
  const match = MatchBuilder.aMatch().withBetId("betId").build();
  await strategyRepository.create(strategy);
  await matchRepository.create(match);

  const sut = new MatchFinishedHandler({ matchRepository, strategyRepository, broker: brokerSpy, scheduler });
  const event = new MatchFinished(match.id);
  await sut.handle(event);

  expect(brokerSpy.scheduledCommands).toHaveLength(1);
  expect(brokerSpy.scheduledCommands[0].payload).toEqual({ betId: "betId", playerId: "playerId", matchId: match.id });
  expect(brokerSpy.history).toEqual(["verify-bet"]);
});

test("It should not schedule a verifyBet if bet wasn't made in this match", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const strategyRepository = new InMemoryStrategyRepository();
  const scheduler = new TestScheduler();
  const matchRepository = new InMemoryMatchRepository();
  const match = MatchBuilder.aMatch().build();
  await matchRepository.create(match);

  const sut = new MatchFinishedHandler({ matchRepository, strategyRepository, broker: brokerSpy, scheduler });
  const event = new MatchFinished(match.id);
  await sut.handle(event);

  expect(brokerSpy.scheduledCommands).toHaveLength(0);
});

test("It should finish a match and change the status to finished", async () => {
  const matchRepository = new InMemoryMatchRepository();
  const strategyRepository = new InMemoryStrategyRepository();
  const broker = new InMemoryBroker();
  const scheduler = new TestScheduler();
  const match = MatchBuilder.aFullTimeMatch().build();
  await matchRepository.create(match);

  const sut = new MatchFinishedHandler({ matchRepository, strategyRepository, broker, scheduler });
  const event = new MatchFinished(match.id);
  await sut.handle(event);

  const updatedMatch = await matchRepository.findById(match.id);
  expect(updatedMatch.status).toBe("finished");
});
