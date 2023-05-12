import moment from "moment";
import { VerifyBet } from "../../domain/commands/verify-bet";
import { BetLost } from "../../domain/events/bet-lost";
import { BetVerified } from "../../domain/events/bet-verified";
import { BetWon } from "../../domain/events/bet-won";
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

  async handle(input: VerifyBet) {
    const { payload } = input;
    const bet = await this.betGateway.consultBet(payload.betId);
    if (bet.status === "won") {
      await this.broker.publish(new BetWon({ ...payload, outcome: bet.outcome }));
    }
    if (bet.status === "lost") {
      await this.broker.publish(new BetLost(payload));
    }
    if (bet.status === "pending") {
      const fiveMinutesLater = moment().add(5, "minutes").toDate();
      await this.broker.schedule(new VerifyBet(payload), fiveMinutesLater);
      return;
    }
    await this.broker.publish(new BetVerified(payload));
  }
}
