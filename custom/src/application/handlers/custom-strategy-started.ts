import moment from "moment";
import { VerifyOdds } from "../../domain/commands/verify-odds";
import { CustomStrategyStarted } from "../../domain/events/custom-strategy-started";
import { Broker } from "../ports/brokers/broker";
import { HttpClient } from "../ports/http/http-client";

type Matches = {
  id: string;
  name: string;
  date: string;
};

export class CustomStrategyStartedHandler {
  constructor(private httpClient: HttpClient, private broker: Broker) {}

  async handle(event: CustomStrategyStarted): Promise<void> {
    const { payload } = event;
    const now = `${moment().format("YYYY-MM-DD")}T${moment().format("HH:mm")}:00.000Z`;
    const oneMinuteBeforeMidnight = `${moment().format("YYYY-MM-DD")}T23:59:00.000Z`;
    const { data } = await this.httpClient.get(`http://player:3000/matches?from=${now}&to=${oneMinuteBeforeMidnight}`);
    const matches = data as Matches[];
    for (const match of matches) {
      const { id: matchId, name, date } = match;
      const fiveMinutesBeforeGameStart = moment(date).subtract(5, "minutes").toDate();
      await this.broker.schedule(new VerifyOdds(payload, { matchId, name }), fiveMinutesBeforeGameStart);
    }
  }
}
