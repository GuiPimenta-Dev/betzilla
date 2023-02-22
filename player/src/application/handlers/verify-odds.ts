import { Broker } from "../ports/brokers/broker";
import { BetGateway } from "../ports/gateways/bet";
import { Handler } from "./handler";

type Dependencies = {
  betGateway: BetGateway;
  broker: Broker;
};

export class VerifyOddsHandler implements Handler {
  name = "verify-odds";
  private betGateway: BetGateway;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.betGateway = input.betGateway;
    this.broker = input.broker;
  }

  async handle(input: any) {}
}
