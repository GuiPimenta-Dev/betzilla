import { BotRepository } from "../../application/ports/repositories/bot";
import { Bot } from "../../domain/entities/bots/bot";
import { PlayerRules } from "../../domain/entities/bots/player-rules";

export class InMemoryBotRepository implements BotRepository {
  private bots: Bot[] = [];

  async create(input: Bot): Promise<void> {
    this.bots.push(input);
  }

  async findById(id: string): Promise<Bot> {
    const bot = this.bots.find((bot) => bot.id === id);
    if (!bot) throw new Error("Bot not found");
    return new PlayerRules({
      id: bot.id,
      name: bot.name,
      playerId: bot.playerId,
      market: bot.market,
      side: bot.side,
      betValue: bot.betValue,
      conditions: bot.conditions,
    });
  }
}
