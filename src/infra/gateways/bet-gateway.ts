import { Bet, BetGateway } from "../../../src/application/ports/gateways/bet";

export class FakeBetGateway implements BetGateway {
  bet: number;

  async makeBet(bet: number) {
    this.bet = bet;
  }

  async consultBet(): Promise<Bet> {
    if (Math.random() <= 0.5) return { status: "won", amount: this.bet * 2 };
    return { status: "lost", amount: 0 };
  }
}
