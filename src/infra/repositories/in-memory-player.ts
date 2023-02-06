import { PlayerRepository } from "../../application/ports/repositories/player";
import { Player } from "../../domain/player";
import { NotFound } from "../../utils/http-status/not-found";

export class InMemoryPlayerRepository implements PlayerRepository {
  players: Player[] = [];

  async findById(id: string): Promise<Player> {
    const player = this.players.find((player) => player.id === id);
    if (!player) throw new NotFound("Player not found");
    return player;
  }

  async update(player: Player): Promise<void> {
    const index = this.players.findIndex((a) => a.id === player.id);
    this.players[index] = player;
  }

  async create(player: Player): Promise<void> {
    this.players.push(player);
  }

  createDefaultPlayer(): void {
    const player = new Player({ id: "default", email: "guialvespimenta27@gmail.com", balance: 1000 });
    this.players.push(player);
  }
}
