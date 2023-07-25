import { Bot, Condition } from "../../../src/domain/entities/bot";

export class BotBuilder {
  conditions: Condition[] = [];
  status: boolean = true;
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

  withRunning(status: boolean): BotBuilder {
    this.status = status;
    return this;
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
      running: this.status,
      marketId: 1,
      side: "back",
      betValue: 10,
      conditions: this.conditions,
    });
  }
}
