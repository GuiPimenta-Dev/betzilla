export type Bet = { status: "pending" | "won" | "lost"; amount: number };

export interface BetGateway {
  makeBet(value: number): Promise<boolean>;
  consultBet(id: string): Promise<Bet>;
}
