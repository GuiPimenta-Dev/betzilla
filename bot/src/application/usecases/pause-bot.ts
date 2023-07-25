import { BotRepository } from "../ports/repositories/bot";

type Dependencies = {
  botRepository: BotRepository;
};

type Input = {
  botId: string;
  playerId: string;
};

export class PauseBot {
  private botRepository: BotRepository;

  constructor(input: Dependencies) {
    this.botRepository = input.botRepository;
  }

  async execute(input: Input): Promise<void> {
    const bot = await this.botRepository.findById(input.botId);
    if (bot.playerId !== input.playerId) throw new Error("Unauthorized");
    bot.pause();
    await this.botRepository.update(bot);
  }
}
