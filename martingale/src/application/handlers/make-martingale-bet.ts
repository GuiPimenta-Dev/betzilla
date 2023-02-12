import { MakeBet } from "../../domain/commands/make-bet";
import { MakeMartingaleBet } from "../../domain/commands/make-martingale-bet";
import { Bet } from "../../domain/entities/bet";
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
    const bet = new Bet({ ...payload, value: martingale.getBet(), playerId: martingale.playerId });
    await this.broker.publish(new MakeBet(bet));
  }
}
