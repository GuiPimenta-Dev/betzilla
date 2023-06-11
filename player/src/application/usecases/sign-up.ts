import { v4 as uuid } from "uuid";
import { Password } from "../../domain/entities/password";
import { Player } from "../../domain/entities/player";
import { BadRequest } from "../../infra/http/status/bad-request";
import { PlayerRepository } from "../ports/repositories/player";

type Dependencies = {
  playerRepository: PlayerRepository;
};

type Input = {
  name: string;
  email: string;
  password: string;
};

export class Signup {
  playerRepository: PlayerRepository;

  constructor(input: Dependencies) {
    this.playerRepository = input.playerRepository;
  }

  async execute(input: Input): Promise<void> {
    const isEmailInUse = await this.playerRepository.findByEmail(input.email);
    if (isEmailInUse) throw new BadRequest("Email already Exists");
    const id = uuid();
    const password = await Password.create(input.password);
    const player = new Player({ id, ...input, password, balance: 0 });
    await this.playerRepository.create(player);
  }
}
