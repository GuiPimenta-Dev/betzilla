import { BotRepository } from "../../application/ports/repositories/bot";
import { NotFound } from "../../infra/http/status/not-found";
import { Bot } from "../entities/bots/bot";
import { PlayerRules } from "../entities/bots/player-rules";
import { Match } from "../entities/match";
import { Odd } from "../events/odds-verified";

type Dependencies = {
  botRepository: BotRepository;
};

type ShouldBet = {
  shouldBet: boolean;
  bot: Bot;
};

type Condition = {
  name: string;
  value?: number;
  params?: any;
};

type BotProps = {
  id: string;
  name: string;
  playerId: string;
  market: string;
  side: string;
  betValue: number;
  conditions?: Condition[];
};

export class BotService {
  botRepository: BotRepository;

  constructor(input: Dependencies) {
    this.botRepository = input.botRepository;
  }

  static getBot(bot: BotProps): Bot {
    const bots = {
      "player-rules": new PlayerRules({ ...bot, conditions: bot.conditions }),
    };
    const botInstance = bots[bot.name];
    if (!botInstance) throw new NotFound("Bot not found");
    return botInstance;
  }

  async shouldBet(match: Match, odds: Odd[]): Promise<ShouldBet> {
    const bot = await this.botRepository.findById(match.botId);
    const shouldBet = bot.shouldBet(match, odds);
    return { shouldBet, bot };
  }

  getBiggestOdd(odds: Odd[], type: string): { oddId: string; odd: number } {
    let biggestOdd: number = 0;
    let oddId: string;
    for (const odd of odds) {
      const odds = odd[type];
      const max = Math.max(...odds);
      if (max >= biggestOdd) {
        biggestOdd = max;
        oddId = odd.id;
      }
    }
    return { oddId, odd: biggestOdd };
  }
}
