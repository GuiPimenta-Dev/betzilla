import { Martingale } from "../../domain/martingale";
import { MakeBetCommand } from "../commands/make-bet";
import { MakeMartingaleBetCommand } from "../commands/make-martingale-bet";
import { VerifyMartingaleCommand } from "../commands/verify-martingale";
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
    const martingale = await this.martingaleRepository.findById(payload.martingaleId);
    await this.publishMakeBetCommand(martingale);
    await this.scheduleVerifyMartingaleCommand(martingale);
  }

  private async publishMakeBetCommand(martingale: Martingale) {
    const commandPayload = {
      martingaleId: martingale.id,
      playerId: martingale.playerId,
      betValue: martingale.getBet(),
    };
    const command = new MakeBetCommand(commandPayload);
    await this.broker.publish(command);
  }

  private async scheduleVerifyMartingaleCommand(martingale: Martingale) {
    const commandPayload = { martingaleId: martingale.id };
    const command = new VerifyMartingaleCommand(commandPayload);
    await this.broker.schedule(command);
  }
}
