import moment from "moment";
import { VerifyOdds } from "../../domain/commands/verify-odds";
import { Match } from "../../domain/entities/match";
import { MatchStarted } from "../../domain/events/match-started";
import { Broker } from "../ports/brokers/broker";
import { MatchRepository } from "../ports/repositories/match";
import { Handler } from "./handler";

type Dependencies = {
  matchRepository: MatchRepository;
  broker: Broker;
};

export class MatchStartedHandler implements Handler {
  name = "match-started";
  private matchRepository: MatchRepository;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.matchRepository = input.matchRepository;
    this.broker = input.broker;
  }

  async handle(event: MatchStarted): Promise<void> {
    const { matchId, botId, name, market, date } = event.payload;
    const match = Match.start({ id: matchId, name, botId: botId, date });
    await this.matchRepository.create(match);
    const now = moment().toDate();
    await this.broker.schedule(new VerifyOdds({ matchId, market }), now);
  }
}
