import { Martingale } from "../../domain/martingale";
import { MakeBetCommand } from "../commands/make-bet";
import { MakeMartingaleBetCommand } from "../commands/make-martingale-bet";
import { VerifyMartingaleCommand } from "../commands/verify-martingale";
import { MartingaleFinishedEvent } from "../events/martingale-finished";
import { Broker } from "../ports/brokers/broker";
import { MartingaleRepository } from "../ports/repositories/martingale";

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
    if (martingale.isFinished()) return await this.publishMartingaleFinishedEvent(martingale);
    await this.publishMakeBetCommand(martingale);
    await this.scheduleVerifyMartingaleCommand(martingale);
  }

  private async publishMartingaleFinishedEvent(martingale: Martingale) {
    const eventPayload = { martingaleId: martingale.id, playerId: martingale.playerId };
    const event = new MartingaleFinishedEvent(eventPayload);
    await this.broker.publish(event);
  }

  private async publishMakeBetCommand(martingale: Martingale) {
    const commandPayload = { betId: martingale.id, playerId: martingale.playerId, betValue: martingale.getBet() };
    const command = new MakeBetCommand(commandPayload);
    await this.broker.publish(command);
  }

  private async scheduleVerifyMartingaleCommand(martingale: Martingale) {
    const commandPayload = { id: martingale.id };
    const command = new VerifyMartingaleCommand(commandPayload);
    await this.broker.schedule(command);
  }
}
