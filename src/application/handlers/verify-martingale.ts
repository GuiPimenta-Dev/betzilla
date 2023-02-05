import { BetGateway } from "../ports/gateways/bet";
import { Broker } from "../ports/brokers/broker";
import { Handler } from "./handler";
import { MartingaleRepository } from "../ports/repositories/martingale";
import { MartingaleVerifiedEvent } from "../events/martingale-verified";
import { VerifyMartingaleCommand } from "../commands/verify-martingale";

type Dependencies = {
  betGateway: BetGateway;
  martingaleRepository: MartingaleRepository;
  broker: Broker;
};

export class VerifyMartingaleHandler implements Handler {
  name = "verify-martingale";
  private betGateway: BetGateway;
  private martingaleRepository: MartingaleRepository;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.betGateway = input.betGateway;
    this.martingaleRepository = input.martingaleRepository;
    this.broker = input.broker;
  }

  async handle(input: VerifyMartingaleCommand) {
    const { payload } = input;
    const martingale = await this.martingaleRepository.findById(payload.id);
    const status = await this.betGateway.verifyBetStatus(payload.betId);
    if (status === "won") martingale.win();
    if (status === "lost") martingale.lose();
    if (status !== "pending") await this.martingaleRepository.update(martingale);
    const event = new MartingaleVerifiedEvent({ betId: martingale.id, status, accountId: martingale.accountId });
    this.broker.publish(event);
  }
}
