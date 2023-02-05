import { BetGateway } from "../ports/gateways/bet";
import { Broker } from "../ports/brokers/broker";
import { MakeBet } from "../usecases/make-bet";
import { MakeBetCommand } from "../commands/make-bet";
import { PlayerRepository } from "../ports/repositories/player";

type Dependencies = {
  playerRepository: PlayerRepository;
  betGateway: BetGateway;
  broker: Broker;
};

export class MakeBetHandler {
  name = "make-bet";
  private broker: Broker;
  private playerRepository: PlayerRepository;
  private betGateway: BetGateway;

  constructor(input: Dependencies) {
    this.playerRepository = input.playerRepository;
    this.betGateway = input.betGateway;
    this.broker = input.broker;
  }

  async handle(input: MakeBetCommand) {
    const { payload } = input;
    const usecase = new MakeBet({
      playerRepository: this.playerRepository,
      betGateway: this.betGateway,
      broker: this.broker,
    });
    await usecase.execute(payload);
  }
}
