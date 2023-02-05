import { Martingale } from "../../domain/martingale";
import { MartingaleRepository } from "../../application/ports/repositories/martingale";

export class InMemoryMartingaleRepository implements MartingaleRepository {
  private readonly martingales: Martingale[] = [];

  async findById(id: string): Promise<Martingale> {
    const bet = this.martingales.find((bet) => bet.id === id);
    if (!bet) throw new Error("Bet not found");
    return bet;
  }

  async create(martingale: Martingale): Promise<void> {
    this.martingales.push(martingale);
  }

  async update(martingale: Martingale): Promise<void> {
    const index = this.martingales.findIndex((bet) => bet.id === martingale.id);
    if (index === -1) throw new Error("Martingale not found");
    this.martingales[index] = martingale;
  }
}
