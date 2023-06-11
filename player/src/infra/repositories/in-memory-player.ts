import { PlayerRepository } from "../../application/ports/repositories/player";
import { Password } from "../../domain/entities/password";
import { Player } from "../../domain/entities/player";
import { NotFound } from "../http/status/not-found";

export class InMemoryPlayerRepository implements PlayerRepository {
  players: Player[];
  constructor() {
    this.players = [];
  }

  async findById(id: string): Promise<Player> {
    const player = this.players.find((player) => player.id === id);
    if (!player) throw new NotFound("Player not found");
    return player;
  }

  async update(player: Player): Promise<void> {
    const index = this.players.findIndex((a) => a.id === player.id);
    this.players[index] = player;
  }

  async findByEmail(email: string): Promise<Player> {
    return this.players.find((player) => player.email === email);
  }

  async create(player: Player): Promise<void> {
    this.players.push(player);
  }

  async createDefaultPlayer(): Promise<void> {
    const password = await Password.create("12345678");
    const player = new Player({ id: "default", name: "username", password, email: "default@test.com", balance: 1000 });
    this.create(player);
  }
}
