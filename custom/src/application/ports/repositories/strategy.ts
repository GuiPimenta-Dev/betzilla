export enum StrategyName {
  OVER_05_HT = "over-05-ht",
}

export type StrategyInfo = {
  id: string;
  name: StrategyName;
  playerId: string;
  value: number;
};

export interface StrategyRepository {
  create(input: StrategyInfo): Promise<void>;
  findById(id: string): Promise<StrategyInfo>;
}
