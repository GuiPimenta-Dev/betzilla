import moment from "moment";
import { VerifyOdds } from "../../domain/commands/verify-odds";
import { CustomStrategyStarted } from "../../domain/events/custom-strategy-started";
import { Broker } from "../ports/brokers/broker";
import { HttpClient } from "../ports/http/http-client";
import { Handler } from "./handler";

type Dependencies = {
  httpClient: HttpClient;
  broker: Broker;
};

type Matches = {
  id: string;
  name: string;
  date: string;
};

export class CustomStrategyStartedHandler implements Handler {
  name = "custom-strategy-started";
  private httpClient: HttpClient;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.httpClient = input.httpClient;
    this.broker = input.broker;
  }

  async handle(event: CustomStrategyStarted): Promise<void> {
    const { payload } = event;
    const { data } = await this.httpClient.get(`http://player:3000/matches/today/upcoming`);
    const matches = data as Matches[];
    for (const match of matches) {
      const { id: matchId, name, date } = match;
      const fiveMinutesBeforeGameStart = moment(date).subtract(5, "minutes").toDate();
      await this.broker.schedule(new VerifyOdds(payload, { matchId, name }), fiveMinutesBeforeGameStart);
    }
  }
}
