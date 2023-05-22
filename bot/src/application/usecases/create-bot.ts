import { v4 as uuid } from "uuid";
import { Condition } from "../../domain/entities/bots/bot";
import { BotCreated } from "../../domain/events/bot-created";
import { BotService } from "../../domain/services/bot";
import { Broker } from "../ports/brokers/broker";
import { BotRepository } from "../ports/repositories/bot";

type Dependencies = {
  botRepository: BotRepository;
  broker: Broker;
};

type Bot = {
  name: string;
  market: string;
  side: string;
  betValue: number;
  conditions: Condition[];
};

type Input = {
  bot: Bot;
  playerId: string;
};

export class CreateBot {
  private botRepository: BotRepository;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.botRepository = input.botRepository;
    this.broker = input.broker;
  }

  async execute(input: Input): Promise<Output> {
    const bot = { id: uuid(), playerId: input.playerId, ...input.bot };
    const botInstance = BotService.getBot(bot);
    await this.botRepository.create(botInstance);
    await this.broker.publish(new BotCreated({ botId: bot.id, market: bot.market }));
    return { botId: bot.id };
  }
}

type Output = {
  botId: string;
};
