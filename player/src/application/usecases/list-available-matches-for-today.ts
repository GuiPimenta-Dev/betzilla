import { BetGateway, Match } from "../ports/gateways/bet";

import moment from "moment";

type Dependencies = {
  betGateway: BetGateway;
};

export class ListTodayUpcomingMatches {
  private betGateway: BetGateway;

  constructor(input: Dependencies) {
    this.betGateway = input.betGateway;
  }

  async execute(): Promise<Match[]> {
    const now = moment();
    const matches = await this.betGateway.listTodayMatches();
    return matches.filter((match: any) => moment(match.date) > now);
  }
}
