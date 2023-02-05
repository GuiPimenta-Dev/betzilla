import { Martingale } from "../../../domain/martingale";

export interface MartingaleRepository {
  findById(id: string): Promise<Martingale>;
  create(martingale: Martingale): Promise<void>;
}
