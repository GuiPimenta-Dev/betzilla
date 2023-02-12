import { HistoryItem, MartingaleRepository } from "../../application/ports/repositories/martingale";

import { Martingale } from "../../domain/entities/martingale";
import { NotFound } from "../http/status/not-found";

export class InMemoryMartingaleRepository implements MartingaleRepository {
  private readonly martingales: Martingale[];
  private readonly history: HistoryItem[];

  constructor() {
    this.martingales = [];
    this.history = [];
  }

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

  async createHistoryItem(history: HistoryItem): Promise<void> {
    this.history.push(history);
  }

  async updateHistory(history: HistoryItem): Promise<void> {
    const index = this.history.findIndex((historyItem) => historyItem.betId === history.betId);
    this.history.splice(index, 1, history);
  }

  async findHistory(id: string): Promise<HistoryItem[]> {
    return this.history.filter((history) => history.martingaleId === id);
  }

  createDefaultMartingale() {
    const settings = { id: "default", playerId: "default", initialBet: 10, rounds: 1, multiplier: 2 };
    const martingale = new Martingale(settings);
    this.create(martingale);
  }
}
