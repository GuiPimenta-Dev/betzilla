import { MakeBet } from "../../domain/commands/make-bet";
import { VerifyOdds } from "../../domain/commands/verify-odds";
import { Bot } from "../../domain/entities/bot";
import { MatchStatus } from "../../domain/entities/match";
import { OddsVerified } from "../../domain/events/odds-verified";
import { ExpectedValue } from "../../domain/services/positive-ev";
import { Broker } from "../ports/brokers/broker";
import { HttpClient } from "../ports/http/http-client";
import { BotRepository } from "../ports/repositories/bot";
import { MatchRepository } from "../ports/repositories/match";
import { Scheduler } from "../ports/scheduler/scheduler";
import { Handler } from "./handler";

type Dependencies = {
  botRepository: BotRepository;
  matchRepository: MatchRepository;
  httpClient: HttpClient;
  broker: Broker;
  scheduler: Scheduler;
};

type BiggestEV = {
  expectedValue: number;
  marketId?: string;
  side?: string;
  oddId?: string;
  odd?: number;
};

export class PEVOddsVerifiedHandler implements Handler {
  name = "odds-verified";

  private broker: Broker;
  private matchRepository: MatchRepository;
  private botRepository: BotRepository;
  private scheduler: Scheduler;
  private httpClient: HttpClient;

  constructor(input: Dependencies) {
    this.botRepository = input.botRepository;
    this.matchRepository = input.matchRepository;
    this.broker = input.broker;
    this.scheduler = input.scheduler;
    this.httpClient = input.httpClient;
  }

  async handle(event: OddsVerified): Promise<void> {
    const { payload } = event;
    const match = await this.matchRepository.findById(payload.matchId);
    if (match.status === MatchStatus.FINISHED) return;
    const bot = await this.botRepository.findById(match.botId);
    if (bot.name !== "pev") return;
    const { data: markets } = await this.httpClient.get(`http://bet:3001/matches/${match.id}/markets`);
    const biggestEV = await this.calculateBiggestEV(markets, bot);
    if (biggestEV.expectedValue > 0) {
      await this.broker.publish(
        new MakeBet({
          matchId: match.id,
          marketId: biggestEV.marketId,
          side: biggestEV.side,
          betValue: bot.betValue,
          playerId: bot.playerId,
          oddId: biggestEV.oddId,
          odd: biggestEV.odd,
        })
      );
    }
    const timeToVerifyOdds = this.scheduler.timeToVerifyEV();
    await this.broker.schedule(new VerifyOdds({ matchId: match.id, market: bot.market }), timeToVerifyOdds);
  }

  private async calculateBiggestEV(markets: any, bot: Bot): Promise<BiggestEV> {
    let biggestEV = { expectedValue: 0 };
    for (const market of markets) {
      const { data: odds } = await this.httpClient.get(`http://bet:3001/markets/${market.id}/odds`);
      for (const odd of odds) {
        const service = new ExpectedValue(odd, bot.betValue);
        const backEV = service.getEV("back");
        const layEV = service.getEV("lay");
        const marketBiggestEV = backEV.expectedValue > layEV.expectedValue ? backEV : layEV;
        if (marketBiggestEV.expectedValue > biggestEV.expectedValue) {
          biggestEV = marketBiggestEV;
        }
      }
    }
    return biggestEV;
  }
}
