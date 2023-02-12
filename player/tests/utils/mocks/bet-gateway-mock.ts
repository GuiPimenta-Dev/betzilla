import { BetGateway, BetStatus } from "../../../src/application/ports/gateways/bet";

export class BetGatewayMock implements BetGateway {
  makeBetResponse: boolean = true;
  consultBetResponse: BetStatus;

  async makeBet(): Promise<{ success: boolean }> {
    return { success: this.makeBetResponse };
  }

  async consultBet(): Promise<BetStatus> {
    return this.consultBetResponse;
  }

  mockMakeBetResponse(betWasMade: boolean) {
    this.makeBetResponse = betWasMade;
  }

  mockConsultBetResponse(bet: BetStatus) {
    this.consultBetResponse = bet;
  }
}
