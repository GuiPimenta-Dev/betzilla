import { Player } from "../../../domain/entities/player";

export interface PlayerRepository {
  create(player: Player): Promise<void>;
  findById(id: string): Promise<Player>;
  update(player: Player): Promise<void>;
}
