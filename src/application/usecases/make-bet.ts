import { BadRequest } from "../../utils/http-status/bad-request";
import { DebitPlayerAccountCommand } from "../commands/debit-player-account";
import { Broker } from "../ports/brokers/broker";
import { BetGateway } from "../ports/gateways/bet";
import { PlayerRepository } from "../ports/repositories/player";

type Dependencies = {
  playerRepository: PlayerRepository;
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
    const event = new DebitPlayerAccountCommand({ playerId: input.playerId, amount: input.betValue });
    await this.broker.publish(event);
  }
}
