import { Bot } from "../../../domain/entities/bots/bot";

export interface BotRepository {
  create(input: Bot): Promise<void>;
  findById(id: string): Promise<Bot>;
}
