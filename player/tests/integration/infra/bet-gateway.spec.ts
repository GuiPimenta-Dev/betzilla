import { BetFairAdapter } from "../../../src/infra/gateways/bet-fair-adapter";
import AxiosAdapter from "../../../src/infra/http/axios-adapter";

test("It should be able to make a login", async () => {
  const httpClient = new AxiosAdapter();
  const betFairAdapter = new BetFairAdapter(httpClient);

  await betFairAdapter.login();

  expect(betFairAdapter.TOKEN).toBeDefined();
});

test("It should be able to list events", async () => {
  const httpClient = new AxiosAdapter();
  const betFairAdapter = new BetFairAdapter(httpClient);
  await betFairAdapter.login();

  const events = await betFairAdapter.listMatchesForToday();

  expect(events).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        date: expect.any(String),
      }),
    ])
  );
});

test("It should retrieve a list of markets for a given match", async () => {
  const httpClient = new AxiosAdapter();
  const betFairAdapter = new BetFairAdapter(httpClient);
  await betFairAdapter.login();
  const matches = await betFairAdapter.listMatchesForToday();

  const markets = await betFairAdapter.listMatchMarkets(matches[0].id);

  expect(markets).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
      }),
    ])
  );
});

test("It should retrieve a list of odds for a given market", async () => {
  const httpClient = new AxiosAdapter();
  const betFairAdapter = new BetFairAdapter(httpClient);
  await betFairAdapter.login();
  const matches = await betFairAdapter.listMatchesForToday();
  const markets = await betFairAdapter.listMatchMarkets(matches[0].id);

  const odds = await betFairAdapter.listMarketOdds(markets[0].id);

  expect(odds.status).toBeDefined();
  expect(odds.odds).toBeDefined();
});
