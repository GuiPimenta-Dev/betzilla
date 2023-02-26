import { StrategyName, StrategyRepository } from "../ports/repositories/strategy";

import moment from "moment";
import { MakeBet } from "../../domain/commands/make-bet";
import { VerifyOdds } from "../../domain/commands/verify-odds";
import { Bet } from "../../domain/entities/bet";
import { MatchStatus } from "../../domain/entities/match";
import { Over05HT } from "../../domain/entities/over-05-ht";
import { OddsVerified } from "../../domain/events/odds-verified";
import { Broker } from "../ports/brokers/broker";
import { MatchRepository } from "../ports/repositories/match";
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
    const match = await this.matchRepository.findById(payload.match.id);
    if (match.status === MatchStatus.FINISHED) return;
    const strategy = await this.strategyRepository.findById(match.strategyId);
    const strategyInstance = this.getStrategy(strategy.name);
    const { shouldBet, bet } = strategyInstance.bet(payload.odds);
    if (shouldBet) {
      await this.broker.publish(
        new MakeBet(
          new Bet({
            id: bet.id,
            strategy: { id: strategy.id, name: strategy.name },
            value: strategy.value,
            playerId: strategy.playerId,
            odd: bet.odd,
          })
        )
      );
    } else {
      const fiveMinutesLater = moment().add(5, "minutes").toDate();
      await this.broker.schedule(new VerifyOdds(strategy, payload.match), fiveMinutesLater);
    }
  }

  private getStrategy(strategy: string) {
    const strategies = {
      [StrategyName.OVER_05_HT]: () => new Over05HT(),
    };
    return strategies[strategy]();
  }
}
