import { BetWonHandler } from "../../../src/application/handlers/bet-won";
import { BetWon } from "../../../src/domain/events/bet-won";
import { InMemoryAnalyticsRepository } from "../../../src/infra/repositories/in-memory-analytics";

test("It should change the status of a match to won", async () => {
  const analyticsRepository = new InMemoryAnalyticsRepository();
  const bet = {
    matchId: "matchId",
    playerId: "playerId",
    botId: "botId",
    match: "matchName",
    market: "market",
    debit: 100,
    status: "pending",
    timestamp: new Date(),
  };
  analyticsRepository.create(bet);

  const handler = new BetWonHandler({ analyticsRepository });
  const event = new BetWon({ matchId: "matchId", outcome: 200 });
  await handler.handle(event);

  const match = await analyticsRepository.findByMatchId("matchId");
  expect(match.debit).toBe(100);
  expect(match.credit).toBe(200);
  expect(match.profit).toBe(100);
  expect(match.status).toBe("won");
});
