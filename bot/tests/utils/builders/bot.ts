import { Bot, Condition } from "../../../src/domain/entities/bots/bot";

import { PlayerRules } from "../../../src/domain/entities/bots/player-rules";

export class BotBuilder {
  conditions: Condition[] = [];
  name: string;

  static aPlayerRules(): BotBuilder {
    const bot = new BotBuilder();
    bot.name = "player-rules";
    return bot;
  }

  withConditions(conditions: Condition[]): BotBuilder {
    this.conditions = conditions;
    return this;
  }

  build(): Bot {
    if (this.name === "player-rules") {
      return new PlayerRules({
        id: "botId",
        name: "player-rules",
        playerId: "playerId",
        market: "market",
        side: "back",
        betValue: 10,
        conditions: this.conditions,
      });
    }
  }
}
