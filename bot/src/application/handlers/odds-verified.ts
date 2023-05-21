import { MakeBet } from "../../domain/commands/make-bet";
import { VerifyOdds } from "../../domain/commands/verify-odds";
import { MatchStatus } from "../../domain/entities/match";
import { OddsVerified } from "../../domain/events/odds-verified";
import { BotService } from "../../domain/services/bot";
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

export class OddsVerifiedHandler implements Handler {
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
    const botService = new BotService({ botRepository: this.botRepository });
    const { shouldBet, bot } = await botService.shouldBet(match, payload.odds);
    if (shouldBet) {
      const { oddId, odd } = botService.getBiggestOdd(payload.odds, bot.side);
      await this.broker.publish(
        new MakeBet({
          matchId: match.id,
          marketId: bot.market,
          side: bot.side,
          betValue: bot.betValue,
          playerId: bot.playerId,
          oddId,
          odd,
        })
      );
    } else {
      const timeToVerifyOdds = this.scheduler.timeToVerifyOdds();
      await this.broker.schedule(new VerifyOdds({ matchId: match.id, market: bot.market }), timeToVerifyOdds);
    }
  }
}
