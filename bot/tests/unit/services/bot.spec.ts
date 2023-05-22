import { PlayerRules } from "../../../src/domain/entities/bots/player-rules";
import { BotService } from "../../../src/domain/services/bot";

test("It should get a bot from the name", () => {
  const bot = BotService.getBot({
    id: "1",
    name: "player-rules",
    playerId: "1",
    market: "match-odds",
    side: "back",
    betValue: 1.5,
    conditions: [],
  });

  expect(bot).toBeInstanceOf(PlayerRules);
});

test("it should throw an error if bot is not found", () => {
  expect(() => {
    BotService.getBot({
      id: "1",
      name: "not-found",
      playerId: "1",
      market: "match-odds",
      side: "back",
      betValue: 1.5,
      conditions: [],
    });
  }).toThrow("Bot not found");
});

test("It should get the biggest odd", () => {
  const odds = [
    {
      id: "1",
      back: [1.01, 1.5, 1.03],
      lay: [1.04, 1.05, 1.06],
    },
    {
      id: "2",
      back: [1.0, 1.3, 1.02],
      lay: [1.04, 1.05, 1.06],
    },
  ];
  const service = new BotService({ botRepository: null });

  const biggestOdd = service.getBiggestOdd(odds, "back");

  expect(biggestOdd.oddId).toBe("1");
  expect(biggestOdd.odd).toBe(1.5);
});
