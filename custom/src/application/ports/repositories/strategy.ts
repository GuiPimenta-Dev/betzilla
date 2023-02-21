export type CustomStrategy = {
  id: string;
  playerId: string;
  strategyString: string;
};

export interface StrategyRepository {
  create(input: CustomStrategy): Promise<void>;
}
