import { Match, MatchStatus } from "../../domain/entities/match";
import { Odd, OddsVerified } from "../../domain/events/odds-verified";

import moment from "moment";
import { MakeBet } from "../../domain/commands/make-bet";
import { VerifyOdds } from "../../domain/commands/verify-odds";
import { Strategy } from "../../domain/entities/strategy";
import { RuleFactory } from "../../domain/rules/factory";
import { Broker } from "../ports/brokers/broker";
import { MatchRepository } from "../ports/repositories/match";
import { StrategyRepository } from "../ports/repositories/strategy";
import { Handler } from "./handler";

type Dependencies = {
  strategyRepository: StrategyRepository;
  matchRepository: MatchRepository;
  broker: Broker;
};

export class OddsVerifiedHandler implements Handler {
  name = "odds-verified";

  private broker: Broker;
  private matchRepository: MatchRepository;
  private strategyRepository: StrategyRepository;

  constructor(input: Dependencies) {
    this.strategyRepository = input.strategyRepository;
    this.matchRepository = input.matchRepository;
    this.broker = input.broker;
  }

  async handle(event: OddsVerified): Promise<void> {
    const { payload } = event;
    const match = await this.matchRepository.findById(payload.matchId);
    if (match.status === MatchStatus.FINISHED) return;
    const strategy = await this.strategyRepository.findById(match.strategyId);
    const shouldBet = this.shouldBet(match, payload.odds, strategy);
    if (shouldBet) {
      const { oddId, odd } = this.getBiggestOdd(payload.odds, strategy.type);
      await this.broker.publish(
        new MakeBet({
          matchId: match.id,
          marketId: strategy.market,
          type: strategy.type,
          betValue: strategy.betValue,
          playerId: strategy.playerId,
          oddId,
          odd,
        })
      );
    } else {
      const fiveMinutesLater = moment().add(5, "minutes").toDate();
      await this.broker.schedule(new VerifyOdds({ matchId: match.id, market: strategy.market }), fiveMinutesLater);
    }
  }

  private shouldBet(match: Match, odds: Odd[], strategy: Strategy): boolean {
    const ruleFactory = new RuleFactory(match, odds, strategy.type);
    const rules = ruleFactory.getRules(strategy.conditions);
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
