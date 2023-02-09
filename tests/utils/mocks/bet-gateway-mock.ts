import { Bet, BetGateway } from "../../../src/application/ports/gateways/bet";

export class BetGatewayMock implements BetGateway {
  betValue: number;
  bets: Bet[] = [{ status: "lost", amount: 0 }];
  betIndex: number = 0;
  betWasMade: boolean = true;

  async makeBet(value: number): Promise<{ success: boolean }> {
    this.betValue = value;
    return { success: this.betWasMade };
  }

  async consultBet(): Promise<Bet> {
    const response = this.bets[this.betIndex];
    this.betIndex++;
    return response;
  }

  mockMakeBetResponse(betWasMade: boolean) {
    this.betWasMade = betWasMade;
  }

  mockConsultBetResponse(bets: Bet[]) {
    this.bets = bets;
  }
}
