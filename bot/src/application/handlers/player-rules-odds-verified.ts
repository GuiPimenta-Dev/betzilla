import { Match, MatchStatus } from "../../domain/entities/match";
import { Odd, OddsVerified } from "../../domain/events/odds-verified";

import { MakeBet } from "../../domain/commands/make-bet";
import { VerifyOdds } from "../../domain/commands/verify-odds";
import { Bot } from "../../domain/entities/bot";
import { RuleFactory } from "../../domain/services/rules/factory";
import { Broker } from "../ports/brokers/broker";
import { BotRepository } from "../ports/repositories/bot";
import { MatchRepository } from "../ports/repositories/match";
import { Scheduler } from "../ports/scheduler/scheduler";
import { Handler } from "./handler";

type Dependencies = {
  botRepository: BotRepository;
  matchRepository: MatchRepository;
  broker: Broker;
  scheduler: Scheduler;
};

export class PlayerRulesOddsVerifiedHandler implements Handler {
  name = "odds-verified";

  private broker: Broker;
  private matchRepository: MatchRepository;
  private botRepository: BotRepository;
  private scheduler: Scheduler;

  constructor(input: Dependencies) {
    this.botRepository = input.botRepository;
    this.matchRepository = input.matchRepository;
    this.broker = input.broker;
    this.scheduler = input.scheduler;
  }

  async handle(event: OddsVerified): Promise<void> {
    const { payload } = event;
    const match = await this.matchRepository.findById(payload.matchId);
    if (match.status === MatchStatus.FINISHED) return;
    const bot = await this.botRepository.findById(match.botId);
    if (bot.name !== "player-rules") return;
    const shouldBet = this.shouldBet(match, payload.odds, bot);
    if (shouldBet) {
      const { oddId, odd } = this.getBiggestOdd(payload.odds, bot.side);
      await this.broker.publish(
        new MakeBet({
          matchId: match.id,
          marketId: bot.marketId,
          side: bot.side,
          betValue: bot.betValue,
          playerId: bot.playerId,
          oddId,
          odd,
        })
      );
    } else {
      const timeToVerifyOdds = this.scheduler.timeToVerifyOdds();
      await this.broker.schedule(new VerifyOdds({ matchId: match.id, marketId: bot.marketId }), timeToVerifyOdds);
    }
  }

  private shouldBet(match: Match, odds: Odd[], bot: Bot): boolean {
    const ruleFactory = new RuleFactory(match, odds, bot.side);
    const rules = ruleFactory.getRules(bot.conditions);
    for (const rule of rules) {
      if (!rule.shouldBet()) {
        return false;
      }
    }
    return true;
  }

  private getBiggestOdd(odds: Odd[], type: string): { oddId: string; odd: number } {
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
