import { MakeMartingaleBetCommand } from "../../../domain/commands/martingale/make-martingale-bet";
import { Martingale } from "../../../domain/entities/martingale/martingale";
import { MartingaleFinishedEvent } from "../../../domain/events/martingale/martingale-finished";
import { BetVerifiedEvent } from "../../../domain/events/player/bet-verified";
import { Broker } from "../../ports/brokers/broker";
import { MartingaleRepository } from "../../ports/repositories/martingale";
import { Handler } from "../handler";

type Dependencies = {
  broker: Broker;
  martingaleRepository: MartingaleRepository;
};

export class BetVerifiedHandler implements Handler {
  name = "bet-verified";
  broker: Broker;
  martingaleRepository: MartingaleRepository;

  constructor(input: Dependencies) {
    this.broker = input.broker;
    this.martingaleRepository = input.martingaleRepository;
  }

  async handle(input: BetVerifiedEvent): Promise<void> {
    const { payload } = input;
    const martingale = await this.martingaleRepository.findById(payload.betId);
    if (martingale.isFinished()) {
      return await this.publishMartingaleFinishedEvent(martingale);
    }
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
}
