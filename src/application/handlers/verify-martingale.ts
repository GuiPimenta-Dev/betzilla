import { BetGateway } from "../ports/gateways/bet";
import { Broker } from "../ports/brokers/broker";
import { CreditPlayerAccountCommand } from "../commands/credit-player-account";
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
    const bet = await this.betGateway.verifyBet(payload.betId);
    const investiment = martingale.getBet();
    if (bet.status === "won") {
      const history = {
        id: martingale.id,
        winner: true,
        investiment,
        outcome: bet.amount,
        profit: bet.amount - investiment,
      };
      await this.martingaleRepository.saveHistory(history);
      martingale.win();
      const command = new CreditPlayerAccountCommand({ playerId: martingale.playerId, amount: bet.amount });
      await this.broker.publish(command);
    }
    if (bet.status === "lost") {
      const history = { id: martingale.id, winner: false, investiment, outcome: 0, profit: -investiment };
      await this.martingaleRepository.saveHistory(history);
      martingale.lose();
    }
    if (bet.status !== "pending") await this.martingaleRepository.update(martingale);
    const eventPayload = { betId: martingale.id, status: bet.status, playerId: martingale.playerId };
    const event = new MartingaleVerifiedEvent(eventPayload);
    await this.broker.publish(event);
  }
}
