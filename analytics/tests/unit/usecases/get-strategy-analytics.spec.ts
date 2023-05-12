import { GetStrategyAnalytics } from "../../../src/application/usecases/get-strategy-analytics";
import { InMemoryAnalyticsRepository } from "../../../src/infra/repositories/in-memory-analytics";
import { FakeHttpClient } from "../../utils/mocks/fake-http-client";

test("It should be able to get analytics about a strategy", async () => {
  const analyticsRepository = new InMemoryAnalyticsRepository();
  const httpClient = new FakeHttpClient();
  const history = [
    {
      matchId: "matchId",
      playerId: "playerId",
      strategyId: "strategyId",
      match: "A X B",
      market: "market",
      debit: 100,
      credit: null,
      profit: null,
      status: "pending",
      timestamp: new Date(),
    },
    {
      matchId: "matchId",
      playerId: "playerId",
      strategyId: "strategyId",
      match: "C X D",
      market: "market",
      debit: 100,
      credit: 600,
      profit: 500,
      status: "won",
      timestamp: new Date(),
    },
    {
      matchId: "matchId",
      playerId: "playerId",
      strategyId: "strategyId",
      match: "C X D",
      market: "market",
      debit: 100,
      credit: 300,
      profit: 200,
      status: "won",
      timestamp: new Date(),
    },
    {
      matchId: "matchId",
      playerId: "playerId",
      strategyId: "strategyId",
      match: "C X D",
      market: "market",
      debit: 100,
      credit: 0,
      profit: -100,
      status: "lost",
      timestamp: new Date(),
    },
  ];
  history.forEach((bet) => analyticsRepository.create(bet));
  const strategy = { playerId: "playerId", id: "id", type: "type", betValue: 20, market: "market", conditions: [] };
  httpClient.mockGet({ statusCode: 200, data: strategy });

  const sut = new GetStrategyAnalytics({ analyticsRepository, httpClient });
  const analytics = await sut.execute("strategyId");

  expect(analytics).toEqual({
    strategy,
    analytics: {
      totalDebit: 400,
      totalCredit: 900,
      totalProfit: 500,
      totalWon: 2,
      totalLost: 1,
      totalPending: 1,
      winRate: 66.67,
      roi: 125,
    },
    history,
  });
});
