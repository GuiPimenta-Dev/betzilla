import { PauseBot } from "../../../src/application/usecases/pause-bot";
import { InMemoryBotRepository } from "../../../src/infra/repositories/in-memory-bot";
import { BotBuilder } from "../../utils/builders/bot";

test("It should pause a bot", async () => {
  const botRepository = new InMemoryBotRepository();
  const bot = BotBuilder.aBot().build();
  await botRepository.create(bot);
  const sut = new PauseBot({ botRepository });

  const input = { botId: bot.id, playerId: "playerId" };
  await sut.execute(input);

  const bot_ = await botRepository.findById(bot.id);
  expect(bot_.running).toBe(false);
});
