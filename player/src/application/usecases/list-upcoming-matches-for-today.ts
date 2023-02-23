import { BetGateway, Match } from "../ports/gateways/bet";

import moment from "moment";

type Dependencies = {
  betGateway: BetGateway;
};

export class ListUpcomingMatchesForToday {
  private betGateway: BetGateway;

  constructor(input: Dependencies) {
    this.betGateway = input.betGateway;
  }

  async execute(date: moment.Moment): Promise<Match[]> {
    const matches = await this.betGateway.listMatchesForToday();
    return matches.filter((match: any) => moment(match.date) > date);
  }
}
