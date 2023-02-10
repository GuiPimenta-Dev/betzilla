import { Martingale } from "../../../domain/entities/martingale";

export type HistoryItem = {
  itemId: string;
  martingaleId: string;
  winner: boolean | string;
  investiment?: number;
  outcome?: number;
  profit?: number;
};

export interface MartingaleRepository {
  findById(id: string): Promise<Martingale>;
  create(martingale: Martingale): Promise<void>;
  update(martingale: Martingale): Promise<void>;
  saveHistory(history: HistoryItem): Promise<void>;
  updateHistory(history: HistoryItem): Promise<void>;
  findHistory(id: string): Promise<HistoryItem[]>;
}
