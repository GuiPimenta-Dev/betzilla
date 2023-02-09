import { BetMadeEvent } from "../../../domain/events/player/bet-made";
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
  name = "bet-made";
  private playerRepository: PlayerRepository;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.playerRepository = input.playerRepository;
    this.broker = input.broker;
  }

  async handle(input: BetMadeEvent): Promise<void> {
    const { payload } = input;
    const player = await this.playerRepository.findByBetId(payload.betId);
    try {
      player.account.debit(payload.betValue);
      await this.playerRepository.update(player);
      const event = new DebitMadeEvent({ playerId: player.id, amount: payload.betValue });
      await this.broker.publish(event);
    } catch (error) {
      const event = new DebitFailedEvent({ playerId: player.id, amount: payload.betValue });
      await this.broker.publish(event);
    }
  }
}
