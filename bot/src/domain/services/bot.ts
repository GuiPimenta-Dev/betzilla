import { BotRepository } from "../../application/ports/repositories/bot";
import { Bot } from "../entities/bots/bot";
import { Match } from "../entities/match";
import { Odd } from "../events/odds-verified";

type Dependencies = {
  botRepository: BotRepository;
};

type ShouldBet = {
  shouldBet: boolean;
  bot: Bot;
};

export class BotService {
  botRepository: BotRepository;

  constructor(input: Dependencies) {
    this.botRepository = input.botRepository;
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
