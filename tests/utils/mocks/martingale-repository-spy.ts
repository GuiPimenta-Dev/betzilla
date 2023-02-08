import { HistoryItem, MartingaleRepository } from "../../../src/application/ports/repositories/martingale";

import { Martingale } from "../../../src/domain/martingale";

export class MartingaleRepositorySpy implements MartingaleRepository {
  itemSaved: HistoryItem;
  itemUpdated: HistoryItem;
  constructor(private martingaleRepository: MartingaleRepository) {}

  findById(id: string): Promise<Martingale> {
    return this.martingaleRepository.findById(id);
  }

  create(martingale: Martingale): Promise<void> {
    return this.martingaleRepository.create(martingale);
  }

  update(martingale: Martingale): Promise<void> {
    return this.martingaleRepository.update(martingale);
  }

  saveHistory(history: HistoryItem): Promise<void> {
    this.itemSaved = { ...history };
    return this.martingaleRepository.saveHistory(history);
  }

  updateHistory(history: HistoryItem): Promise<void> {
    this.itemUpdated = { ...history };
    return this.martingaleRepository.updateHistory(history);
  }

  findHistory(id: string): Promise<HistoryItem[]> {
    return this.martingaleRepository.findHistory(id);
  }
}
