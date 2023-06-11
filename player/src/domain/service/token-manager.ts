import { sign, verify } from "jsonwebtoken";

import { Player } from "../entities/player";

export class TokenManager {
  static generate(player: Player) {
    return sign({ id: player.id }, process.env.JWT_SECRET as string, { expiresIn: "40min" });
  }

  static verify(token: string): any {
    return verify(token, process.env.JWT_SECRET as string);
  }
}
