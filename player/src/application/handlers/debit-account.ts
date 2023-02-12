import { BetMade } from "../../domain/events/bet-made";
import { DebitFailed } from "../../domain/events/debit-failed";
import { DebitMade } from "../../domain/events/debit-made";
import { Broker } from "./../ports/brokers/broker";
import { PlayerRepository } from "./../ports/repositories/player";
import { Handler } from "./handler";

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

  async handle(input: BetMade): Promise<void> {
    const { payload } = input;
    const player = await this.playerRepository.findById(payload.playerId);
    try {
      player.account.debit(payload.value);
      await this.playerRepository.update(player);
      await this.broker.publish(new DebitMade(payload));
    } catch (error) {
      await this.broker.publish(new DebitFailed(payload));
    }
  }
}
