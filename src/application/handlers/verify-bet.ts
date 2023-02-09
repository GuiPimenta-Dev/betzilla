import { VerifyBetCommand } from "../commands/verify-bet";
import { BetLostEvent } from "../events/bet-lost";
import { BetVerifiedEvent } from "../events/bet-verified";
import { BetWonEvent } from "../events/bet-won";
import { Broker } from "../ports/brokers/broker";
import { BetGateway } from "../ports/gateways/bet";
import { Handler } from "./handler";

type Dependencies = {
  betGateway: BetGateway;
  broker: Broker;
};

export class VerifyBetHandler implements Handler {
  name = "verify-bet";
  private betGateway: BetGateway;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.betGateway = input.betGateway;
    this.broker = input.broker;
  }

  async handle(input: VerifyBetCommand) {
    const { payload } = input;
    const bet = await this.betGateway.consultBet(payload.martingaleId);
    if (bet.status === "won") {
      await this.broker.publish(new BetWonEvent({ betId: payload.betId, amount: bet.amount }));
    }
    if (bet.status === "lost") {
      await this.broker.publish(new BetLostEvent({ betId: payload.betId }));
    }
    if (bet.status === "pending") {
      return await this.broker.schedule(new VerifyBetCommand({ betId: payload.betId }));
    }
    await this.broker.publish(new BetVerifiedEvent({ betId: payload.betId, status: bet.status }));
  }
}
