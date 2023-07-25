import { ListBots } from "../../../src/application/usecases/list-bots";
import { InMemoryBotRepository } from "../../../src/infra/repositories/in-memory-bot";
import { BotBuilder } from "../../utils/builders/bot";

test("It should list all bots", async () => {
  const botRepository = new InMemoryBotRepository();
  const bot1 = BotBuilder.aBot().build();
  const bot2 = BotBuilder.aBot().build();
  await botRepository.create(bot1);
  await botRepository.create(bot2);
  const sut = new ListBots({ botRepository });

  const { bots } = await sut.execute("playerId");

  expect(bots).toHaveLength(2);
});
