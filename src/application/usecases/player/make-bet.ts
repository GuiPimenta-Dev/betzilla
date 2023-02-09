import { BetMadeEvent } from "../../../domain/events/player/bet-made";
import { BadRequest } from "../../../utils/http-status/bad-request";
import { Broker } from "../../ports/brokers/broker";
import { BetGateway } from "../../ports/gateways/bet";

type Dependencies = {
  betGateway: BetGateway;
  broker: Broker;
};

type Input = {
  playerId: string;
  betValue: number;
  betId: string;
};

export class MakeBet {
  private betGateway: BetGateway;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.betGateway = input.betGateway;
    this.broker = input.broker;
  }

  async execute(input: Input): Promise<void> {
    const betWasMade = await this.betGateway.makeBet(input.betValue);
    if (!betWasMade) throw new BadRequest("Bet was not made");
    const event = new BetMadeEvent({ betId: input.betId, playerId: input.playerId, betValue: input.betValue });
    await this.broker.publish(event);
  }
}
