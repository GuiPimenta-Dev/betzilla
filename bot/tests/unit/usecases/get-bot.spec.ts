import { GetBot } from "../../../src/application/usecases/get-bot";
import { InMemoryBotRepository } from "../../../src/infra/repositories/in-memory-bot";
import { BotBuilder } from "../../utils/builders/bot";

test("It should get a bot", async () => {
  const botRepository = new InMemoryBotRepository();
  const bot = BotBuilder.aPlayerRules().build();
  botRepository.create(bot);

  const sut = new GetBot({ botRepository });
  const _bot = await sut.execute(bot.id);

  expect(_bot).toEqual(bot);
});
