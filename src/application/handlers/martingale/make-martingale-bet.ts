import { Martingale } from "../../../domain/martingale";
import { MakeBetCommand } from "../../commands/make-bet";
import { MakeMartingaleBetCommand } from "../../commands/martingale/make-martingale-bet";
import { VerifyBetCommand } from "../../commands/verify-bet";
import { Broker } from "../../ports/brokers/broker";
import { MartingaleRepository } from "../../ports/repositories/martingale";

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
    const commandPayload = { betId: martingale.id, playerId: martingale.playerId, betValue: martingale.getBet() };
    const command = new MakeBetCommand(commandPayload);
    await this.broker.publish(command);
  }

  private async scheduleVerifyMartingaleCommand(martingale: Martingale) {
    const commandPayload = { betId: martingale.id };
    const command = new VerifyBetCommand(commandPayload);
    await this.broker.schedule(command);
  }
}
