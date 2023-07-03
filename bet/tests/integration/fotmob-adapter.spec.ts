import { FotMobAdapter } from "../../src/infra/gateways/fotmob-adapter";
import { AxiosAdapter } from "../../src/infra/http/axios-adapter";

const httpClient = new AxiosAdapter();
const fotmob = new FotMobAdapter(httpClient);

test("It should list all matches for today", async () => {
  const matches = await fotmob.listMatchesForToday();

  expect(matches).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        leagueId: expect.any(String),
        id: expect.any(String),
        name: expect.any(String),
        date: expect.any(String),
      }),
    ])
  );
});

test("It should list all markets for a given match", async () => {
  const markets = await fotmob.listMatchMarkets();

  expect(markets).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
      }),
    ])
  );
});

test("It should list all odds for a given market", async () => {
  const odds = await fotmob.listMarketOdds();

  expect(odds).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        back: expect.any(Array),
        lay: expect.any(Array),
      }),
    ])
  );
});
