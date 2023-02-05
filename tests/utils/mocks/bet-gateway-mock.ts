import { Bet, BetGateway } from "../../../src/application/ports/gateways/bet";

export class BetGatewayMock implements BetGateway {
  betValue: number;
  status: Bet[];
  statusIndex: number = 0;

  async makeBet(value: number) {
    this.betValue = value;
  }

  async verifyBet(): Promise<Bet> {
    const response = this.status[this.statusIndex];
    this.statusIndex++;
    return response;
  }

  mockVerifyBet(status: Bet[]) {
    this.status = status;
  }
}
