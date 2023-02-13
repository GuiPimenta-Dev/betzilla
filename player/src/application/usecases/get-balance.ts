import { Broker } from "../ports/brokers/broker";
import { PlayerRepository } from "../ports/repositories/player";

type Dependencies = {
  broker: Broker;
  playerRepository: PlayerRepository;
};

export default class GetBalance {
  broker: Broker;
  playerRepository: PlayerRepository;

  constructor(input: Dependencies) {
    this.broker = input.broker;
    this.playerRepository = input.playerRepository;
  }

  async execute(playerId: string): Promise<{ balance: number }> {
    const player = await this.playerRepository.findById(playerId);
    return { balance: player.account.getBalance() };
  }
}
