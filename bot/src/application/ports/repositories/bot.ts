import { Bot } from "../../../domain/entities/bot";

export interface BotRepository {
  create(input: Bot): Promise<void>;
  findById(id: string): Promise<Bot>;
}
