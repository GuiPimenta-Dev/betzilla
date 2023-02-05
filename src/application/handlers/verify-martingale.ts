import { BetGateway } from "../ports/gateways/bet";
import { Broker } from "../ports/brokers/broker";
import { CreditAccountCommand } from "../commands/credit-account";
import { Handler } from "./handler";
import { Martingale } from "../../domain/martingale";
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
    const bet = await this.betGateway.verifyBet(payload.betId);
    if (bet.status === "won") {
      martingale.win();
      const command = new CreditAccountCommand({ accountId: martingale.accountId, amount: bet.amount });
      await this.broker.publish(command);
    }
    if (bet.status === "lost") martingale.lose();
    if (bet.status !== "pending") await this.martingaleRepository.update(martingale);
    const event = new MartingaleVerifiedEvent({
      betId: martingale.id,
      status: bet.status,
      accountId: martingale.accountId,
    });
    await this.broker.publish(event);
  }
}
