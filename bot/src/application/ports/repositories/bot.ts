import { Bot } from "../../../domain/entities/bot";

export interface BotRepository {
  create(input: Bot): Promise<void>;
  findById(id: string): Promise<Bot>;
  list(playerId: string): Promise<Bot[]>;
  update(bot: Bot): Promise<void>;
  delete(id: string): Promise<void>;
}
