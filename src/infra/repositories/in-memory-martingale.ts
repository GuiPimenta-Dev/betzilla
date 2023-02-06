import { History, MartingaleRepository } from "../../application/ports/repositories/martingale";

import { Martingale } from "../../domain/martingale";
import { NotFound } from "../../utils/http-status/not-found";

export class InMemoryMartingaleRepository implements MartingaleRepository {
  private readonly martingales: Martingale[] = [];
  private readonly history: History[] = [];

  async findById(id: string): Promise<Martingale> {
    const bet = this.martingales.find((bet) => bet.id === id);
    if (!bet) throw new NotFound("Bet not found");
    return bet;
  }

  async create(martingale: Martingale): Promise<void> {
    this.martingales.push(martingale);
  }

  async update(martingale: Martingale): Promise<void> {
    const index = this.martingales.findIndex((bet) => bet.id === martingale.id);
    if (index === -1) throw new NotFound("Martingale not found");
    this.martingales[index] = martingale;
  }

  async saveHistory(history: History): Promise<void> {
    this.history.push(history);
  }

  async findHistory(id: string): Promise<History[]> {
    return this.history.filter((history) => history.id === id);
  }
}
