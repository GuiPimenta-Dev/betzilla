import { Bet, BetGateway } from "../../../src/application/ports/gateways/bet";

export class BetGatewayMock implements BetGateway {
  betValue: number;
  bets: Bet[] = [{ status: "lost", amount: 0 }];
  betIndex: number = 0;

  async makeBet(value: number): Promise<boolean> {
    this.betValue = value;
    return true;
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
