import { v4 as uuid } from "uuid";
import { DebitPlayerAccountCommand } from "../commands/debit-player-account";
import { BetMadeEvent } from "../events/bet-made";
import { Broker } from "../ports/brokers/broker";
import { MartingaleRepository } from "../ports/repositories/martingale";
import { Handler } from "./handler";

type Dependencies = {
  martingaleRepository: MartingaleRepository;
  broker: Broker;
};

export class BetMadeHandler implements Handler {
  name = "bet-made";
  private martingaleRepository: MartingaleRepository;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
    this.broker = input.broker;
  }

  async handle(input: BetMadeEvent): Promise<void> {
    const { payload } = input;
    const item = { itemId: uuid(), martingaleId: payload.betId, winner: "pending", investiment: payload.betValue };
    await this.martingaleRepository.saveHistory(item);
    const command = new DebitPlayerAccountCommand({ playerId: payload.playerId, amount: payload.betValue });
    await this.broker.publish(command);
  }
}
