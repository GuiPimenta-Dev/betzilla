import { Broker } from "../ports/brokers/broker";
import { HalfTimeFinished } from "../../domain/events/half-time-finished";
import { Handler } from "./handler";
import { HttpClient } from "../ports/http/http-client";
import { Match } from "../../domain/entities/match";
import { MatchFinished } from "../../domain/events/match-finished";
import { MatchRepository } from "../ports/repositories/match";
import { MatchStarted } from "../../domain/events/match-started";
import { StrategyStarted } from "../../domain/events/strategy-started";
import { VerifyOdds } from "../../domain/commands/verify-odds";
import moment from "moment";

type Dependencies = {
  matchRepository: MatchRepository;
  httpClient: HttpClient;
  broker: Broker;
};

type Matches = {
  id: string;
  name: string;
  date: string;
};

export class StrategyStartedHandler implements Handler {
  name = "strategy-started";
  private matchRepository: MatchRepository;
  private httpClient: HttpClient;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.matchRepository = input.matchRepository;
    this.httpClient = input.httpClient;
    this.broker = input.broker;
  }

  async handle(event: StrategyStarted): Promise<void> {
    const { payload } = event;
    const { data } = await this.httpClient.get(`http://player:3000/matches/today/upcoming`);
    const matches = data as Matches[];
    for (const data of matches) {
      const { id, name, date } = data;
      const match = new Match({ id, name, date, strategyId: payload.strategyId });
      await this.matchRepository.create(match);
      const fiveMinutesBeforeGameStart = moment(date).subtract(5, "minutes").toDate();
      const matchStartTime = moment(date).toDate();
      const endOfFirstHalf = moment(date).add(45, "minutes").toDate();
      const matchFinishTime = moment(date).add(90, "minutes").toDate();
      await this.broker.schedule(new VerifyOdds(payload, { id, name }), fiveMinutesBeforeGameStart);
      await this.broker.schedule(new MatchStarted(id), matchStartTime);
      await this.broker.schedule(new HalfTimeFinished(id), endOfFirstHalf);
      await this.broker.schedule(new MatchFinished(id), matchFinishTime);
    }
  }
}
