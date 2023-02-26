import { StrategyName, StrategyRepository } from "../ports/repositories/strategy";

import moment from "moment";
import { MakeBet } from "../../domain/commands/make-bet";
import { VerifyOdds } from "../../domain/commands/verify-odds";
import { Bet } from "../../domain/entities/bet";
import { Over05HT } from "../../domain/entities/over-05-ht";
import { OddsVerified } from "../../domain/events/odds-verified";
import { Broker } from "../ports/brokers/broker";
import { Handler } from "./handler";

type Dependencies = {
  strategyRepository: StrategyRepository;
  broker: Broker;
};

export class OddsVerifiedHandler implements Handler {
  name = "odds-verified";
  private strategyRepository: StrategyRepository;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.strategyRepository = input.strategyRepository;
    this.broker = input.broker;
  }

  async handle(event: OddsVerified): Promise<void> {
    const { payload } = event;
    const strategy = await this.strategyRepository.findById(payload.strategyId);
    const strategies = {
      [StrategyName.OVER_05_HT]: () => new Over05HT(),
    };
    const strategyInstance = strategies[strategy.name]();
    const { shouldBet, bet } = strategyInstance.bet(payload.odds);
    if (shouldBet) {
      await this.broker.publish(
        new MakeBet(
          new Bet({
            id: bet.id,
            strategyId: strategy.id,
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
}
