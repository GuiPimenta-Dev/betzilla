import { CreditPlayerAccountCommand } from "../commands/credit-player-account";
import { CreditMadeEvent } from "../events/credit-made";
import { Broker } from "../ports/brokers/broker";
import { PlayerRepository } from "../ports/repositories/player";
import { Handler } from "./handler";

type Dependencies = {
  playerRepository: PlayerRepository;
  broker: Broker;
};

export class CreditPlayerAccountHandler implements Handler {
  name = "credit-player-account";
  private playerRepository: PlayerRepository;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.playerRepository = input.playerRepository;
    this.broker = input.broker;
  }

  async handle(input: CreditPlayerAccountCommand): Promise<void> {
    const { payload } = input;
    const player = await this.playerRepository.findById(payload.playerId);
    player.account.credit(payload.amount);
    await this.playerRepository.update(player);
    const event = new CreditMadeEvent({ playerId: player.id, amount: payload.amount });
    await this.broker.publish(event);
  }
}
