import { BetGateway, BetStatus } from "../../../src/application/ports/gateways/bet";

export class BetGatewayMock implements BetGateway {
  betValue: number;

  async makeBet(value: number) {
    this.betValue = value;
  }

  async verifyBetStatus(id: string): Promise<BetStatus> {
    return "won";
  }
}
