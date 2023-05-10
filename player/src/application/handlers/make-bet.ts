import { BadRequest } from "../../infra/http/status/bad-request";
import { BetGateway } from "../ports/gateways/bet";
import { BetMade } from "../../domain/events/bet-made";
import { Broker } from "../ports/brokers/broker";
import { MakeBet } from "../../domain/commands/make-bet";

type Dependencies = {
  betGateway: BetGateway;
  broker: Broker;
};

export class MakeBetHandler {
  name = "make-bet";
  private broker: Broker;
  private betGateway: BetGateway;

  constructor(input: Dependencies) {
    this.betGateway = input.betGateway;
    this.broker = input.broker;
  }

  async handle(input: MakeBet) {
    const { marketId, oddId, type, odd, betValue, playerId, matchId } = input.payload;
    const { success, betId } = await this.betGateway.makeBet({ marketId, oddId, type, odd, betValue });
    if (!success) throw new BadRequest("Bet was not made");
    await this.broker.publish(new BetMade({ matchId, betId, playerId, betValue }));
  }
}
