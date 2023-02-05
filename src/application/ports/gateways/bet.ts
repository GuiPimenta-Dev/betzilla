export type BetStatus = "pending" | "won" | "lost";

export interface BetGateway {
  makeBet(value: number): Promise<void>;
  verifyBetStatus(id: string): Promise<BetStatus>;
}
