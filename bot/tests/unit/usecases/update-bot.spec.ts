import { UpdateBot } from "../../../src/application/usecases/update-bot";
import { InMemoryBotRepository } from "../../../src/infra/repositories/in-memory-bot";
import { BotBuilder } from "../../utils/builders/bot";

test("It should update a bot", async () => {
  const botRepository = new InMemoryBotRepository();
  const bot = BotBuilder.aBot().build();
  await botRepository.create(bot);
  const sut = new UpdateBot({ botRepository });

  const input = { bot: { id: bot.id, ...bot, side: "lay" }, playerId: "playerId" };
  await sut.execute(input);

  const bot_ = await botRepository.findById(bot.id);
  expect(bot_.side).toBe("lay");
});
