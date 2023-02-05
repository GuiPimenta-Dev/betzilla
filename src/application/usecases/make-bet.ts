import { BetGateway } from "../ports/gateways/bet";
import { BetMadeEvent } from "../events/bet-made";
import { Broker } from "../ports/brokers/broker";
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
  private playerRepository: PlayerRepository;
  private betGateway: BetGateway;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.playerRepository = input.playerRepository;
    this.betGateway = input.betGateway;
    this.broker = input.broker;
  }

  async execute(input: Input): Promise<void> {
    const player = await this.playerRepository.findById(input.playerId);
    await this.betGateway.makeBet(input.betValue);
    player.account.debit(input.betValue);
    await this.playerRepository.update(player);
    const event = new BetMadeEvent({ ...input });
    await this.broker.publish(event);
  }
}
