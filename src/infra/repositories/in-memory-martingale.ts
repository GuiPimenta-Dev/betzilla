import { Martingale } from "../../domain/martingale";
import { MartingaleRepository } from "../../application/ports/repositories/martingale";

export class InMemoryMartingaleRepository implements MartingaleRepository {
  private readonly bets: Martingale[] = [];

  async findById(id: string): Promise<Martingale> {
    const bet = this.bets.find((bet) => bet.id === id);
    if (!bet) throw new Error("Bet not found");
    return bet;
  }

  async create(martingale: Martingale): Promise<void> {
    this.bets.push(martingale);
  }
}
