import { BotRepository } from "../ports/repositories/bot";

type Dependencies = {
  botRepository: BotRepository;
};

export class ListBots {
  botRepository: BotRepository;

  constructor(input: Dependencies) {
    this.botRepository = input.botRepository;
  }

  async execute(playerId: string) {
    const bots = await this.botRepository.list(playerId);
    return { bots };
  }
}
