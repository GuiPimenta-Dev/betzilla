import { MakeBet } from "../../domain/commands/make-bet";
import { MakeMartingaleBet } from "../../domain/commands/make-martingale-bet";
import { VerifyBet } from "../../domain/commands/verify-bet";
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

  async handle(input: MakeMartingaleBet) {
    const { payload } = input;
    const martingale = await this.martingaleRepository.findById(payload.martingaleId);
    await this.broker.publish(
      new MakeBet({ playerId: payload.playerId, betId: martingale.id, betValue: martingale.getBet() })
    );
    await this.broker.schedule(new VerifyBet({ betId: payload.martingaleId }));
  }
}
