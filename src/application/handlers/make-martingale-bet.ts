import { AccountRepository } from "../ports/repositories/account";
import { BetGateway } from "../ports/gateways/bet";
import { Broker } from "../ports/brokers/broker";
import { MakeBet } from "../usecases/make-bet";
import { MakeBetCommand } from "../commands/make-bet";
import { MakeMartingaleBetCommand } from "../commands/make-martingale-bet";
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
    const commandPayload = { betId: martingale.id, accountId: payload.accountId, betValue: martingale.nextBet() };
    const command = new MakeBetCommand(commandPayload);
    await this.broker.publish(command);
  }
}
