export type Bet = { status: "pending" | "won" | "lost"; amount: number };

export interface BetGateway {
  makeBet(value: number): Promise<void>;
  verifyBet(id: string): Promise<Bet>;
}
