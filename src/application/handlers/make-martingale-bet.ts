import { Broker } from "../ports/brokers/broker";
import { MakeBetCommand } from "../commands/make-bet";
import { MakeMartingaleBetCommand } from "../commands/make-martingale-bet";
import { Martingale } from "../../domain/martingale";
import { MartingaleFinishedEvent } from "../events/martingale-finished";
import { MartingaleRepository } from "../ports/repositories/martingale";
import { VerifyMartingaleCommand } from "../commands/verify-martingale";

type Dependencies = {
  broker: Broker;
  martingaleRepository: MartingaleRepository;
};

export class MakeMartingaleBetHandler {
  name = "make-martingale-bet";
  private broker: Broker;
  private martingaleRepository: MartingaleRepository;

  constructor(input: Dependencies) {
    this.broker = input.broker;
    this.martingaleRepository = input.martingaleRepository;
  }

  async handle(input: MakeMartingaleBetCommand) {
    const { payload } = input;
    const martingale = await this.martingaleRepository.findById(payload.id);
    if (martingale.isFinished()) {
      const event = new MartingaleFinishedEvent({ id: martingale.id });
      return await this.broker.publish(event);
    }
    await this.publishMakeBetCommand(martingale);
    await this.publishVerifyMartingaleCommand(martingale);
  }

  private async publishMakeBetCommand(martingale: Martingale) {
    const commandPayload = { betId: martingale.id, accountId: martingale.accountId, betValue: martingale.nextBet() };
    const command = new MakeBetCommand(commandPayload);
    await this.broker.publish(command);
  }

  private async publishVerifyMartingaleCommand(martingale: Martingale) {
    const commandPayload = { id: martingale.id };
    const command = new VerifyMartingaleCommand(commandPayload);
    await this.broker.schedule(command);
  }
}
