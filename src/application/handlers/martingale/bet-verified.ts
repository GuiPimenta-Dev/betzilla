import { MakeMartingaleBetCommand } from "../../../domain/commands/martingale/make-martingale-bet";
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
      return await this.broker.publish(
        new MartingaleFinishedEvent({ martingaleId: martingale.id, playerId: martingale.playerId })
      );
    }
    const command = new MakeMartingaleBetCommand({ martingaleId: martingale.id, playerId: martingale.playerId });
    await this.broker.publish(command);
  }
}
