import { Bot, Condition } from "../../../src/domain/entities/bot";

export class BotBuilder {
  conditions: Condition[] = [];
  name: string;

  static aBot(): BotBuilder {
    return new BotBuilder();
  }

  static aPlayerRules(): BotBuilder {
    const bot = new BotBuilder();
    bot.name = "player-rules";
    return bot;
  }

  static aPEV(): BotBuilder {
    const bot = new BotBuilder();
    bot.name = "pev";
    return bot;
  }

  withConditions(conditions: Condition[]): BotBuilder {
    this.conditions = conditions;
    return this;
  }

  build(): Bot {
    return new Bot({
      id: "botId",
      name: this.name,
      playerId: "playerId",
      market: "market",
      side: "back",
      betValue: 10,
      conditions: this.conditions,
    });
  }
}
