import moment from "moment";
import { VerifyOdds } from "../../domain/commands/verify-odds";
import { StrategyStarted } from "../../domain/events/strategy-started";
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

export class StrategyStartedHandler implements Handler {
  name = "strategy-started";
  private httpClient: HttpClient;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.httpClient = input.httpClient;
    this.broker = input.broker;
  }

  async handle(event: StrategyStarted): Promise<void> {
    const { payload } = event;
    const { data } = await this.httpClient.get(`http://player:3000/matches/today/upcoming`);
    const matches = data as Matches[];
    for (const match of matches) {
      const { id, name, date } = match;
      const fiveMinutesBeforeGameStart = moment(date).subtract(5, "minutes").toDate();
      await this.broker.schedule(new VerifyOdds(payload, { id, name }), fiveMinutesBeforeGameStart);
    }
  }
}
