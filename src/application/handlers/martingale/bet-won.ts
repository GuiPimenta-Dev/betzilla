import { UpdateHistoryItemCommand } from "../../../domain/commands/martingale/update-pending-history-item";
import { CreditAccountCommand } from "../../../domain/commands/player/credit-account";
import { Martingale } from "../../../domain/entities/martingale/martingale";
import { BetWonEvent } from "../../../domain/events/player/bet-won";
import { Broker } from "../../ports/brokers/broker";
import { MartingaleRepository } from "../../ports/repositories/martingale";
import { Handler } from "../handler";

type Dependencies = {
  martingaleRepository: MartingaleRepository;
  broker: Broker;
};

export class BetWonHandler implements Handler {
  name = "bet-won";
  martingaleRepository: MartingaleRepository;
  broker: Broker;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
    this.broker = input.broker;
  }

  async handle(event: BetWonEvent): Promise<void> {
    const { payload } = event;
    const martingale = await this.martingaleRepository.findById(payload.betId);
    const profit = payload.amount - martingale.getBet();
    martingale.win();
    await this.martingaleRepository.update(martingale);
    await this.publishUpdateHistoryItemCommand(martingale, payload.amount, profit);
    await this.publishCreditPlayerAccountCommand(martingale, payload.amount);
  }

  private async publishUpdateHistoryItemCommand(martingale: Martingale, amount: number, profit: number) {
    const commandPayload = { martingaleId: martingale.id, winner: true, outcome: amount, profit };
    await this.broker.publish(new UpdateHistoryItemCommand(commandPayload));
  }

  private async publishCreditPlayerAccountCommand(martingale: Martingale, amount: number) {
    const commandPayload = { playerId: martingale.playerId, amount };
    await this.broker.publish(new CreditAccountCommand(commandPayload));
  }
}
