import { PlayerRepository } from "../../application/ports/repositories/player";
import { Player } from "../../domain/entities/player";
import { NotFound } from "../http/status/not-found";

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
    const player = new Player({ id: "default", email: "default@test.com", balance: 1000 });
    this.create(player);
  }
}
