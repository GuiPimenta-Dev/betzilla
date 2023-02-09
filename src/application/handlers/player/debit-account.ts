import { DebitAccountCommand } from "../../../domain/commands/player/debit-account";
import { DebitFailedEvent } from "../../../domain/events/player/debit-failed";
import { DebitMadeEvent } from "../../../domain/events/player/debit-made";
import { Broker } from "../../ports/brokers/broker";
import { PlayerRepository } from "../../ports/repositories/player";
import { Handler } from "../handler";

type Dependencies = {
  playerRepository: PlayerRepository;
  broker: Broker;
};

export class DebitAccountHandler implements Handler {
  name = "debit-account";
  private playerRepository: PlayerRepository;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.playerRepository = input.playerRepository;
    this.broker = input.broker;
  }

  async handle(input: DebitAccountCommand): Promise<void> {
    const { payload } = input;
    const player = await this.playerRepository.findById(payload.playerId);
    try {
      player.account.debit(payload.amount);
      await this.playerRepository.update(player);
      const event = new DebitMadeEvent({ playerId: player.id, amount: payload.amount });
      await this.broker.publish(event);
    } catch (error) {
      const event = new DebitFailedEvent({ playerId: player.id, amount: payload.amount });
      await this.broker.publish(event);
    }
  }
}
