import { VerifyOdds } from "../../domain/commands/verify-odds";
import { Match } from "../../domain/entities/match";
import { MatchStarted } from "../../domain/events/match-started";
import { Broker } from "../ports/brokers/broker";
import { HttpClient } from "../ports/http/http-client";
import { MatchRepository } from "../ports/repositories/match";
import { Handler } from "./handler";

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
    const { matchId } = event.payload;
    const { data } = await this.httpClient.get("http://player:3000/matches/markets", { matchId });
    const match = Match.start({ id: matchId, ...event.payload, markets: data });
    await this.matchRepository.create(match);
    await this.broker.publish(new VerifyOdds(match));
  }
}
