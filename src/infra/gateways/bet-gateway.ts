import { Bet, BetGateway } from "../../../src/application/ports/gateways/bet";

export class FakeBetGateway implements BetGateway {
  async makeBet() {}

  async consultBet(): Promise<Bet> {
    if (Math.random() > 0.5) return { status: "won", amount: Math.round(Math.random() * 100) + 20 };
    return { status: "lost", amount: 0 };
  }
}
