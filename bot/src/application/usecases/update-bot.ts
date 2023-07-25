import { Condition } from "../../domain/entities/bot";
import { BotRepository } from "../ports/repositories/bot";

type Dependencies = {
  botRepository: BotRepository;
};

type BotProps = {
  id: string;
  name: string;
  marketId: number;
  side: string;
  betValue: number;
  conditions?: Condition[];
};

type Input = {
  bot: BotProps;
  playerId: string;
};

export class UpdateBot {
  private botRepository: BotRepository;

  constructor(input: Dependencies) {
    this.botRepository = input.botRepository;
  }

  async execute(input: Input): Promise<void> {
    const bot = await this.botRepository.findById(input.bot.id);
    if (bot.playerId !== input.playerId) throw new Error("Unauthorized");
    bot.betValue = input.bot.betValue;
    bot.conditions = input.bot.conditions;
    bot.marketId = input.bot.marketId;
    bot.name = input.bot.name;
    bot.side = input.bot.side;
    await this.botRepository.update(bot);
  }
}
