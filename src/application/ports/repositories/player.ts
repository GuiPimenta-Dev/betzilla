import { Player } from "../../../domain/entities/player/player";

export interface PlayerRepository {
  findById(id: string): Promise<Player>;
  findByBetId(betId: string): Promise<Player>;
  update(player: Player): Promise<void>;
  create(player: Player): Promise<void>;
}
