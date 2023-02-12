export type BetStatus = { status: "pending" | "won" | "lost"; outcome: number };

export interface BetGateway {
  makeBet(value: number): Promise<{ success: boolean }>;
  consultBet(id: string): Promise<BetStatus>;
}
