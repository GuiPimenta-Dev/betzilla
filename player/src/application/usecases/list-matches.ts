import { BetGateway, Match } from "../ports/gateways/bet";

import moment from "moment";

type Dependencies = {
  betGateway: BetGateway;
};

type Input = {
  from: string;
  to: string;
};

export class ListMatches {
  private betGateway: BetGateway;

  constructor(input: Dependencies) {
    this.betGateway = input.betGateway;
  }

  async execute(input: Input): Promise<Match[]> {
    const from = moment(input.from);
    const to = moment(input.to);
    return await this.betGateway.listMatches(from, to);
  }
}
