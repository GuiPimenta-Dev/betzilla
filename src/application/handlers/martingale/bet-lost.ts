import { Martingale } from "../../../domain/martingale";
import { UpdateHistoryItemCommand } from "../../commands/martingale/update-pending-history-item";
import { BetLostEvent } from "../../events/bet-lost";
import { Broker } from "../../ports/brokers/broker";
import { MartingaleRepository } from "../../ports/repositories/martingale";
import { Handler } from "../handler";

type Dependencies = {
  martingaleRepository: MartingaleRepository;
  broker: Broker;
};

export class BetLostHandler implements Handler {
  name = "bet-lost";
  martingaleRepository: MartingaleRepository;
  broker: Broker;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
    this.broker = input.broker;
  }

  async handle(event: BetLostEvent): Promise<void> {
    const { payload } = event;
    const martingale = await this.martingaleRepository.findById(payload.betId);
    const lostAmount = martingale.getBet();
    martingale.lose();
    await this.martingaleRepository.update(martingale);
    await this.publishUpdateMartingaleHistoryItemCommand(martingale, lostAmount);
  }

  private async publishUpdateMartingaleHistoryItemCommand(martingale: Martingale, lostAmount: number) {
    const commandPayload = { martingaleId: martingale.id, winner: false, outcome: 0, profit: -lostAmount };
    await this.broker.publish(new UpdateHistoryItemCommand(commandPayload));
  }
}
