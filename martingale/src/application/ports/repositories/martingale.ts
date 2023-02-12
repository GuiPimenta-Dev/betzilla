import { Martingale } from "../../../domain/entities/martingale";

export type HistoryItem = {
  betId: string;
  martingaleId: string;
  winner: boolean | string;
  investiment?: number;
  outcome: number | null;
  profit: number | null;
};

export interface MartingaleRepository {
  findById(id: string): Promise<Martingale>;
  create(martingale: Martingale): Promise<void>;
  update(martingale: Martingale): Promise<void>;
  createHistoryItem(history: HistoryItem): Promise<void>;
  updateHistory(history: HistoryItem): Promise<void>;
  findHistory(id: string): Promise<HistoryItem[]>;
}
