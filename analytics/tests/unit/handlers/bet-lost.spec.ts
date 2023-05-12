import { BetLostHandler } from "../../../src/application/handlers/bet-lost";
import { BetLost } from "../../../src/domain/events/bet-lost";
import { InMemoryAnalyticsRepository } from "../../../src/infra/repositories/in-memory-analytics";

test("It should change the status of a match to lost", async () => {
  const analyticsRepository = new InMemoryAnalyticsRepository();
  const bet = {
    matchId: "matchId",
    playerId: "playerId",
    match: "matchName",
    market: "market",
    strategyId: "strategyId",
    debit: 100,
    status: "pending",
    timestamp: new Date(),
  };
  analyticsRepository.create(bet);

  const handler = new BetLostHandler({ analyticsRepository });
  const event = new BetLost({ matchId: "matchId" });
  await handler.handle(event);

  const match = await analyticsRepository.findByMatchId("matchId");
  expect(match.debit).toBe(100);
  expect(match.credit).toBe(0);
  expect(match.profit).toBe(-100);
  expect(match.status).toBe("lost");
});
