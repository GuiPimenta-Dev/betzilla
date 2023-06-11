import { TokenManager } from "../../domain/service/token-manager";
import { BadRequest } from "../../infra/http/status/bad-request";
import { PlayerRepository } from "../ports/repositories/player";

type Dependencies = {
  playerRepository: PlayerRepository;
};

type Input = {
  email: string;
  password: string;
};

export class Login {
  playerRepository: PlayerRepository;

  constructor(input: Dependencies) {
    this.playerRepository = input.playerRepository;
  }

  async execute(input: Input): Promise<Output> {
    const player = await this.playerRepository.findByEmail(input.email);
    if (!player) throw new BadRequest("Authentication failed");
    const isValidPassword = await player.validatePassword(input.password);
    if (!isValidPassword) throw new BadRequest("Authentication failed");
    const token = TokenManager.generate(player);
    return { token, playerId: player.id };
  }
}

type Output = {
  token: string;
  playerId: string;
};
