import { BetMadeEvent } from "../../../domain/events/player/bet-made";
import { BadRequest } from "../../../utils/http-status/bad-request";
import { Broker } from "../../ports/brokers/broker";
import { BetGateway } from "../../ports/gateways/bet";
import { PlayerRepository } from "../../ports/repositories/player";

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
    const { success } = await this.betGateway.makeBet(input.betValue);
    if (!success) throw new BadRequest("Bet was not made");
    const player = await this.playerRepository.findById(input.playerId);
    player.makeBet(input.betId);
    await this.playerRepository.update(player);
    await this.broker.publish(new BetMadeEvent({ betId: input.betId, betValue: input.betValue }));
  }
}
