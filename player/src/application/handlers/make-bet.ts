import { MakeBet } from "../../domain/commands/make-bet";
import { BetMade } from "../../domain/events/bet-made";
import { BadRequest } from "../../infra/http/status/bad-request";
import { Broker } from "../ports/brokers/broker";
import { BetGateway } from "../ports/gateways/bet";
import { PlayerRepository } from "../ports/repositories/player";

type Dependencies = {
  playerRepository: PlayerRepository;
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
    const { payload } = input;
    const { success } = await this.betGateway.makeBet(payload.betValue);
    if (!success) throw new BadRequest("Bet was not made");
    await this.broker.publish(new BetMade({ ...payload }));
  }
}
