import { Martingale } from "../../../domain/martingale";

export type History = {
  id: string;
  winner: boolean;
  investiment: number;
  outcome: number;
  profit: number;
};

export interface MartingaleRepository {
  findById(id: string): Promise<Martingale>;
  create(martingale: Martingale): Promise<void>;
  update(martingale: Martingale): Promise<void>;
  saveHistory(history: History): Promise<void>;
  findHistory(id: string): Promise<History[]>;
}
