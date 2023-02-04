import { BetGateway } from "../../../src/application/ports/gateways/bet";

export class BetGatewayMock implements BetGateway {
  betValue: number;

  async makeBet(value: number) {
    this.betValue = value;
  }
}
