import moment from "moment";
import { ExecutionStarted } from "../../domain/events/execution-started";
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

export class ExecutionStartedHandler implements Handler {
  name = "execution-started";
  private httpClient: HttpClient;
  private broker: Broker;
  private scheduler: Scheduler;

  constructor(input: Dependencies) {
    this.httpClient = input.httpClient;
    this.broker = input.broker;
    this.scheduler = input.scheduler;
  }

  async handle(event: ExecutionStarted): Promise<void> {
    const { payload } = event;
    const { data } = await this.httpClient.get(`http://player:3000/matches/today/upcoming`);
    const matches = data as Matches[];
    for (const data of matches) {
      const { id, name, date } = data;
      const timeToMatchStart = moment(date).toDate();
      const timeToFirstHalfFinish = this.scheduler.timeToFirstHalfFinish(date);
      const timeToMatchFinish = this.scheduler.timeToMatchFinish(date);
      await this.broker.schedule(
        new MatchStarted({ matchId: id, name, date, strategyId: payload.strategyId, market: payload.market }),
        timeToMatchStart
      );
      await this.broker.schedule(new HalfTimeFinished(id), timeToFirstHalfFinish);
      await this.broker.schedule(new MatchFinished(id), timeToMatchFinish);
    }
  }
}
