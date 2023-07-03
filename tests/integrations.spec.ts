import { faker } from "@faker-js/faker";
import { config as playerConfig } from "../player/src/config";
import AxiosAdapter from "../player/src/infra/http/axios-adapter";
const PLAYER = "http://localhost:3000/player";
const BET = "http://localhost:3001";
const BOT = "http://localhost:3002/bots";
const httpClient = new AxiosAdapter();

let playerId: string;
beforeEach(async () => {
  const email = faker.internet.email();
  const password = "12345678";

  await httpClient.post(`${PLAYER}/signup`, {
    name: faker.person.fullName(),
    password,
    email,
  });

  const { data } = await httpClient.post(`${PLAYER}/login`, {
    email,
    password,
  });

  playerId = data.playerId;
});

test("It should display the balance", async () => {
  const { data: balance } = await httpClient.get(`${PLAYER}/${playerId}/balance`);

  expect(balance.balance).toBe(0);
});

test("It should list all available matches", async () => {
  const { data: matches } = await httpClient.get(`${BET}/matches/today/upcoming`);

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

test("It should create a bot", async () => {
  playerConfig.playerRepository.createDefaultPlayer();
  console.log("oi");
});
