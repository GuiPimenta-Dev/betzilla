import moment from "moment";
import { BotCreated } from "../../domain/events/bot-created";
import { HalfTimeFinished } from "../../domain/events/half-time-finished";
import { MatchFinished } from "../../domain/events/match-finished";
import { MatchStarted } from "../../domain/events/match-started";
import { Broker } from "../ports/brokers/broker";
import { HttpClient } from "../ports/http/http-client";
import { Scheduler } from "../ports/scheduler/scheduler";
import { Handler } from "./handler";

type Dependencies = {
  httpClient: HttpClient;
  broker: Broker;
  scheduler: Scheduler;
};

type Matches = {
  id: string;
  name: string;
  date: string;
};

export class BotCreatedHandler implements Handler {
  name = "bot-created";
  private httpClient: HttpClient;
  private broker: Broker;
  private scheduler: Scheduler;

  constructor(input: Dependencies) {
    this.httpClient = input.httpClient;
    this.broker = input.broker;
    this.scheduler = input.scheduler;
  }

  async handle(event: BotCreated): Promise<void> {
    const { payload } = event;
    const { data } = await this.httpClient.get(`http://bet:3001/matches/today/upcoming`);
    const matches = data as Matches[];
    for (const data of matches) {
      const { id: matchId, name, date } = data;
      const { data: markets } = await this.httpClient.get("http://bet:3001/matches/markets", { matchId });
      const hasMarket = markets.some((market) => market.name === payload.market);
      if (!hasMarket) continue;
      const timeToMatchStart = moment(date).toDate();
      const timeToFirstHalfFinish = this.scheduler.timeToFirstHalfFinish(date);
      const timeToMatchFinish = this.scheduler.timeToMatchFinish(date);
      await this.broker.schedule(
        new MatchStarted({ matchId, name, date, botId: payload.botId, market: payload.market }),
        timeToMatchStart
      );
      await this.broker.schedule(new HalfTimeFinished(matchId), timeToFirstHalfFinish);
      await this.broker.schedule(new MatchFinished(matchId), timeToMatchFinish);
    }
  }
}
