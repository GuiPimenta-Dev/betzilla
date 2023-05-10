import moment from "moment";
import { VerifyBet } from "../../domain/commands/verify-bet";
import { MatchFinished } from "../../domain/events/match-finished";
import { Broker } from "../ports/brokers/broker";
import { MatchRepository } from "../ports/repositories/match";
import { StrategyRepository } from "../ports/repositories/strategy";
import { Handler } from "./handler";

type Dependencies = {
  matchRepository: MatchRepository;
  strategyRepository: StrategyRepository;
  broker: Broker;
};

export class MatchFinishedHandler implements Handler {
  name = "match-finished";
  matchRepository: MatchRepository;
  strategyRepository: StrategyRepository;
  broker: Broker;

  constructor(input: Dependencies) {
    this.matchRepository = input.matchRepository;
    this.strategyRepository = input.strategyRepository;
    this.broker = input.broker;
  }

  async handle(event: MatchFinished): Promise<void> {
    const match = await this.matchRepository.findById(event.payload.matchId);
    match.finish();
    await this.matchRepository.update(match);
    if (match.betId) {
      const strategy = await this.strategyRepository.findById(match.strategyId);
      const fifteenMinutesLater = moment().add(15, "minutes").toDate();
      this.broker.schedule(new VerifyBet({ betId: match.betId, playerId: strategy.playerId }), fifteenMinutesLater);
    }
  }
}
