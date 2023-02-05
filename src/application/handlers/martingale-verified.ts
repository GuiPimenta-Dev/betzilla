import { Martingale } from "../../domain/martingale";
import { MakeMartingaleBetCommand } from "../commands/make-martingale-bet";
import { VerifyMartingaleCommand } from "../commands/verify-martingale";
import { MartingaleFinishedEvent } from "../events/martingale-finished";
import { MartingaleVerifiedEvent } from "../events/martingale-verified";
import { Broker } from "../ports/brokers/broker";
import { MartingaleRepository } from "../ports/repositories/martingale";
import { Handler } from "./handler";

type Dependencies = {
  broker: Broker;
  martingaleRepository: MartingaleRepository;
};

export class MartingaleVerifiedHandler implements Handler {
  name = "martingale-verified";
  broker: Broker;
  martingaleRepository: MartingaleRepository;

  constructor(input: Dependencies) {
    this.broker = input.broker;
    this.martingaleRepository = input.martingaleRepository;
  }

  async handle(input: MartingaleVerifiedEvent): Promise<void> {
    const { payload } = input;
    if (payload.status !== "pending") {
      await this.handleNextBet(payload);
    } else {
      await this.scheduleVerifyMartingaleCommand(payload);
    }
  }

  private async handleNextBet(payload: MartingaleVerifiedEvent["payload"]) {
    const martingale = await this.martingaleRepository.findById(payload.martingaleId);
    if (martingale.isFinished()) return await this.publishMartingaleFinishedEvent(martingale);
    await this.publishMakeMartingaleBetCommand(martingale);
  }

  private async publishMartingaleFinishedEvent(martingale: Martingale) {
    const eventPayload = { martingaleId: martingale.id, playerId: martingale.playerId };
    const event = new MartingaleFinishedEvent(eventPayload);
    await this.broker.publish(event);
  }

  private async publishMakeMartingaleBetCommand(martingale: Martingale) {
    const commandPayload = { martingaleId: martingale.id, playerId: martingale.playerId };
    const command = new MakeMartingaleBetCommand(commandPayload);
    await this.broker.publish(command);
  }

  private async scheduleVerifyMartingaleCommand(payload: MartingaleVerifiedEvent["payload"]) {
    const commandPayload = { martingaleId: payload.martingaleId };
    const command = new VerifyMartingaleCommand(commandPayload);
    await this.broker.schedule(command);
  }
}
