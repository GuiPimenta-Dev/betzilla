import { Bet, BetGateway } from "../ports/gateways/bet";

import { Martingale } from "../../domain/martingale";
import { BadRequest } from "../../utils/http-status/bad-request";
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

type UpdatedHistoryItem = {
  martingaleId: string;
  winner: boolean;
  outcome: number;
  profit: number;
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
    const martingale = await this.martingaleRepository.findById(payload.martingaleId);
    const bet = await this.betGateway.consultBet(payload.martingaleId);
    if (bet.status === "won") await this.handleWon(martingale, bet);
    if (bet.status === "lost") await this.handleLost(martingale);
    if (bet.status !== "pending") await this.martingaleRepository.update(martingale);
    const eventPayload = { martingaleId: martingale.id, status: bet.status, playerId: martingale.playerId };
    const event = new MartingaleVerifiedEvent(eventPayload);
    await this.broker.publish(event);
  }

  private async handleWon(martingale: Martingale, bet: Bet) {
    const profit = bet.amount - martingale.getBet();
    const updatedItem = { martingaleId: martingale.id, winner: true, outcome: bet.amount, profit };
    await this.updatePendingHistoryItem(updatedItem);
    martingale.win();
    const command = new CreditPlayerAccountCommand({ playerId: martingale.playerId, amount: bet.amount });
    await this.broker.publish(command);
  }

  private async handleLost(martingale: Martingale) {
    const updatedItem = { martingaleId: martingale.id, winner: false, outcome: 0, profit: -martingale.getBet() };
    await this.updatePendingHistoryItem(updatedItem);
    martingale.lose();
  }

  private async updatePendingHistoryItem(input: UpdatedHistoryItem) {
    const history = await this.martingaleRepository.findHistory(input.martingaleId);
    const historyItem = history.find((item) => item.winner === "pending");
    if (!historyItem) throw new BadRequest("Pending history item not found");
    historyItem.winner = input.winner;
    historyItem.outcome = input.outcome;
    historyItem.profit = input.profit;
    await this.martingaleRepository.updateHistory(historyItem);
  }
}
