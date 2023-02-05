import { Bet, BetGateway } from "../ports/gateways/bet";

import { Martingale } from "../../domain/martingale";
import { CreditPlayerAccountCommand } from "../commands/credit-player-account";
import { VerifyMartingaleCommand } from "../commands/verify-martingale";
import { MartingaleVerifiedEvent } from "../events/martingale-verified";
import { Broker } from "../ports/brokers/broker";
import { MartingaleRepository } from "../ports/repositories/martingale";
import { Handler } from "./handler";

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
    const bet = await this.betGateway.consultBet(payload.betId);
    if (bet.status === "won") await this.handleWon(martingale, bet);
    if (bet.status === "lost") await this.handleLost(martingale);
    if (bet.status !== "pending") await this.martingaleRepository.update(martingale);
    const eventPayload = { betId: martingale.id, status: bet.status, playerId: martingale.playerId };
    const event = new MartingaleVerifiedEvent(eventPayload);
    await this.broker.publish(event);
  }

  private async handleWon(martingale: Martingale, bet: Bet) {
    const history = {
      id: martingale.id,
      winner: true,
      investiment: martingale.getBet(),
      outcome: bet.amount,
      profit: bet.amount - martingale.getBet(),
    };
    await this.martingaleRepository.saveHistory(history);
    martingale.win();
    const command = new CreditPlayerAccountCommand({ playerId: martingale.playerId, amount: bet.amount });
    await this.broker.publish(command);
  }

  private async handleLost(martingale: Martingale) {
    const history = {
      id: martingale.id,
      winner: false,
      investiment: martingale.getBet(),
      outcome: 0,
      profit: -martingale.getBet(),
    };
    await this.martingaleRepository.saveHistory(history);
    martingale.lose();
  }
}
