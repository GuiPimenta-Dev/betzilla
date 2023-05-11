import { Broker } from "../ports/brokers/broker";
import { Handler } from "./handler";
import { HttpClient } from "../ports/http/http-client";
import { Match } from "../../domain/entities/match";
import { MatchRepository } from "../ports/repositories/match";
import { MatchStarted } from "../../domain/events/match-started";
import { VerifyOdds } from "../../domain/commands/verify-odds";
import moment from "moment";

type Dependencies = {
  matchRepository: MatchRepository;
  httpClient: HttpClient;
  broker: Broker;
};

export class MatchStartedHandler implements Handler {
  name = "match-started";
  private matchRepository: MatchRepository;
  private httpClient: HttpClient;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.matchRepository = input.matchRepository;
    this.httpClient = input.httpClient;
    this.broker = input.broker;
  }

  async handle(event: MatchStarted): Promise<void> {
    const { matchId, strategyId, name, market, date } = event.payload;
    const { data } = await this.httpClient.get("http://bet:3001/matches/markets", { matchId });
    const match = Match.start({ id: matchId, name, strategyId, date, markets: data });
    await this.matchRepository.create(match);
    const now = moment().toDate();
    await this.broker.schedule(new VerifyOdds({ matchId, market }), now);
  }
}
