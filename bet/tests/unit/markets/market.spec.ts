import { MarketFactory } from "../../../src/domain/entities/markets/factory";
import { FotmobBuilder } from "../../utils/builders/fotmob";
import { FakeHttpClient } from "../../utils/mocks/fake-http-client";

const httpClient = new FakeHttpClient();
const marketFactory = new MarketFactory();

test("It should consult the market Under05HT and return false if the total of goals HT is above 1", async () => {
  const under05HT = marketFactory.getMarket(1);
  const events = FotmobBuilder.aMatch().withAwayGoalsHT(2).build();
  httpClient.mockGet({
    statusCode: 200,
    data: events,
  });

  const result = await under05HT.consult();

  expect(result).toBe(false);
});

test("It should consult the market Over05HT and return true if the total of goals HT is below 1", async () => {
  const over05HT = marketFactory.getMarket(2);
  const events = FotmobBuilder.aMatch().withAwayGoalsHT(1).build();
  httpClient.mockGet({
    statusCode: 200,
    data: events,
  });

  const result = await over05HT.consult();

  expect(result).toBe(true);
});

test("BTTS logic should be correct", async () => {
  const bttsHT = marketFactory.getMarket(29);
  const events = FotmobBuilder.aMatch().withAwayGoalsHT(1).withHomeGoalsFT(2).build();
  httpClient.mockGet({
    statusCode: 200,
    data: events,
  });

  const result = await bttsHT.consult();

  expect(result).toBe(true);
});

test("BTTS logic should be correct", async () => {
  const bttsHT = marketFactory.getMarket(29);
  const events = FotmobBuilder.aMatch().withAwayGoalsHT(1).withAwayGoalsFT(2).build();
  httpClient.mockGet({
    statusCode: 200,
    data: events,
  });

  const result = await bttsHT.consult();

  expect(result).toBe(false);
});
