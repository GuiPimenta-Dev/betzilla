import { ResumeBot } from "../../../src/application/usecases/resume-bot";
import { InMemoryBotRepository } from "../../../src/infra/repositories/in-memory-bot";
import { BotBuilder } from "../../utils/builders/bot";

test("It should resume a bot", async () => {
  const botRepository = new InMemoryBotRepository();
  const bot = BotBuilder.aBot().withRunning(false).build();
  await botRepository.create(bot);
  const sut = new ResumeBot({ botRepository });

  const input = { botId: bot.id, playerId: "playerId" };
  await sut.execute(input);

  const bot_ = await botRepository.findById(bot.id);
  expect(bot_.running).toBe(true);
});
