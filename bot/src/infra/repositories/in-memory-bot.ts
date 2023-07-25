import { BotRepository } from "../../application/ports/repositories/bot";
import { Bot } from "../../domain/entities/bot";

export class InMemoryBotRepository implements BotRepository {
  private bots: Bot[] = [];

  async create(input: Bot): Promise<void> {
    this.bots.push(input);
  }

  async findById(id: string): Promise<Bot> {
    return this.bots.find((bot) => bot.id === id);
  }

  async list(playerId: string): Promise<Bot[]> {
    return this.bots.filter((bot) => bot.playerId === playerId);
  }

  async update(bot: Bot): Promise<void> {
    const botIndex = this.bots.findIndex((b) => b.id === bot.id);
    this.bots[botIndex] = bot;
  }

  async delete(id: string): Promise<void> {
    const botIndex = this.bots.findIndex((b) => b.id === id);
    this.bots.splice(botIndex, 1);
  }
}
