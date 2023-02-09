import { MakeBetCommand } from "../../../domain/commands/player/make-bet";
import { Broker } from "../../ports/brokers/broker";
import { BetGateway } from "../../ports/gateways/bet";
import { PlayerRepository } from "../../ports/repositories/player";
import { MakeBet } from "../../usecases/player/make-bet";

type Dependencies = {
  playerRepository: PlayerRepository;
  betGateway: BetGateway;
  broker: Broker;
};

export class MakeBetHandler {
  name = "make-bet";
  private playerRepository: PlayerRepository;
  private broker: Broker;
  private betGateway: BetGateway;

  constructor(input: Dependencies) {
    this.playerRepository = input.playerRepository;
    this.betGateway = input.betGateway;
    this.broker = input.broker;
  }

  async handle(input: MakeBetCommand) {
    const { payload } = input;
    const dependencies = { playerRepository: this.playerRepository, betGateway: this.betGateway, broker: this.broker };
    const usecase = new MakeBet(dependencies);
    await usecase.execute({ playerId: payload.playerId, betValue: payload.betValue, betId: payload.betId });
  }
}
