import { VerifyBet } from "../../domain/commands/verify-bet";
import { MatchFinished } from "../../domain/events/match-finished";
import { Broker } from "../ports/brokers/broker";
import { BotRepository } from "../ports/repositories/bot";
import { MatchRepository } from "../ports/repositories/match";
import { Scheduler } from "../ports/scheduler/scheduler";
import { Handler } from "./handler";

type Dependencies = {
  matchRepository: MatchRepository;
  botRepository: BotRepository;
  broker: Broker;
  scheduler: Scheduler;
};

export class MatchFinishedHandler implements Handler {
  name = "match-finished";
  matchRepository: MatchRepository;
  botRepository: BotRepository;
  broker: Broker;
  scheduler: Scheduler;

  constructor(input: Dependencies) {
    this.matchRepository = input.matchRepository;
    this.botRepository = input.botRepository;
    this.broker = input.broker;
    this.scheduler = input.scheduler;
  }

  async handle(event: MatchFinished): Promise<void> {
    const match = await this.matchRepository.findById(event.payload.matchId);
    if (!match) return;
    match.finish();
    await this.matchRepository.update(match);
    if (match.betId) {
      const bot = await this.botRepository.findById(match.botId);
      const timeToVerifyBet = this.scheduler.timeToVerifyBet();
      this.broker.schedule(
        new VerifyBet({ betId: match.betId, matchId: match.id, playerId: bot.playerId, marketId: bot.marketId }),
        timeToVerifyBet
      );
    }
  }
}
