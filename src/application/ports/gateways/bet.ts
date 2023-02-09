export type Bet = { status: "pending" | "won" | "lost"; amount: number };

export interface BetGateway {
  makeBet(value: number): Promise<{ success: boolean }>;
  consultBet(id: string): Promise<Bet>;
}
