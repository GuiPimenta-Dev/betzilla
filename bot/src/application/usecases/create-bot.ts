import { v4 as uuid } from "uuid";
import { Condition } from "../../domain/entities/bots/bot";
import { BotCreated } from "../../domain/events/bot-created";
import { Broker } from "../ports/brokers/broker";
import { BotRepository } from "../ports/repositories/bot";

type Dependencies = {
  botRepository: BotRepository;
  broker: Broker;
};

type Bot = {
  name: string;
  market: string;
  type: string;
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
    await this.botRepository.create(bot);
    await this.broker.publish(new BotCreated({ botId: bot.id, market: bot.market }));
    return { botId: bot.id };
  }
}

type Output = {
  botId: string;
};
