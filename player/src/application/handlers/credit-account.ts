import { BetWon } from "../../domain/events/bet-won";
import { CreditMade } from "../../domain/events/credit-made";
import { Broker } from "../ports/brokers/broker";
import { PlayerRepository } from "../ports/repositories/player";
import { Handler } from "./handler";

type Dependencies = {
  playerRepository: PlayerRepository;
  broker: Broker;
};

export class CreditAccountHandler implements Handler {
  name = "bet-won";
  private playerRepository: PlayerRepository;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.playerRepository = input.playerRepository;
    this.broker = input.broker;
  }

  async handle(input: BetWon): Promise<void> {
    const { payload } = input;
    const player = await this.playerRepository.findById(payload.playerId);
    player.account.credit(payload.outcome);
    await this.playerRepository.update(player);
    const event = new CreditMade({ playerId: player.id, value: payload.outcome });
    await this.broker.publish(event);
  }
}
