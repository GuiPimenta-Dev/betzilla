import { Bet, BetGateway } from "../../../src/application/ports/gateways/bet";

export class BetGatewayMock implements BetGateway {
  betValue: number;
  bets: Bet[];
  betIndex: number = 0;

  async makeBet(value: number) {
    this.betValue = value;
  }

  async consultBet(): Promise<Bet> {
    const response = this.bets[this.betIndex];
    this.betIndex++;
    return response;
  }

  mockConsultBet(bets: Bet[]) {
    this.bets = bets;
  }
}
