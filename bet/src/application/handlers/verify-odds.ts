import { VerifyOdds } from "../../domain/commands/verify-odds";
import { OddsVerified } from "../../domain/events/odds-verified";
import { Broker } from "../ports/brokers/broker";
import { BetGateway } from "../ports/gateways/bet";
import { Handler } from "./handler";

type Dependencies = {
  betGateway: BetGateway;
  broker: Broker;
};

export class VerifyOddsHandler implements Handler {
  name = "verify-odds";
  private betGateway: BetGateway;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.betGateway = input.betGateway;
    this.broker = input.broker;
  }

  async handle(input: VerifyOdds) {
    const { matchId, market: marketName } = input.payload;
    const markets = await this.betGateway.listMatchMarkets(matchId);
    const market = markets.find((market) => market.name === marketName);
    if (!market) return await this.broker.publish(new OddsVerified({ matchId, odds: null }));
    const odds = await this.betGateway.listMarketOdds(market.id);
    await this.broker.publish(new OddsVerified({ matchId, odds }));
  }
}
