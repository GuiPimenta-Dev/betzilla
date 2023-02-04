export interface BetGateway {
  makeBet(value: number): Promise<void>;
}
