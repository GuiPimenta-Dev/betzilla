import { BotRepository } from "../../application/ports/repositories/bot";
import { Bot } from "../../domain/entities/bots/bot";

export class InMemoryBotRepository implements BotRepository {
  private bots: Bot[] = [];

  async create(input: Bot): Promise<void> {
    this.bots.push(input);
  }

  async findById(id: string): Promise<Bot> {
    return this.bots.find((bot) => bot.id === id);
  }
}
