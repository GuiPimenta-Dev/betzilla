import { BetMadeHandler } from "../../../src/application/handlers/bet-made";
import { BetMade } from "../../../src/domain/events/bet-made";
import { InMemoryAnalyticsRepository } from "../../../src/infra/repositories/in-memory-analytics";
import { FakeHttpClient } from "../../utils/mocks/fake-http-client";

test("It should save in the database a bet was made with status pending", async () => {
  const analyticsRepository = new InMemoryAnalyticsRepository();
  const httpClient = new FakeHttpClient();
  httpClient.mockGet({
    statusCode: 200,
    data: { playerId: "playerId", botId: "botId", name: "A X B", market: "market" },
  });

  const handler = new BetMadeHandler({ analyticsRepository, httpClient });
  const event = new BetMade({ matchId: "matchId", betValue: 100 });
  await handler.handle(event);

  const match = await analyticsRepository.findByMatchId("matchId");
  expect(match).toEqual({
    matchId: "matchId",
    playerId: "playerId",
    botId: "botId",
    match: "A X B",
    debit: 100,
    credit: null,
    profit: null,
    status: "pending",
    timestamp: expect.any(Date),
  });
});
