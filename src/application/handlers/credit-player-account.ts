import { CreditPlayerAccountCommand } from "../commands/credit-player-account";
import { Handler } from "./handler";
import { PlayerRepository } from "../ports/repositories/player";

type Dependencies = {
  playerRepository: PlayerRepository;
};

export class CreditPlayerAccountHandler implements Handler {
  name = "credit-player-account";
  private playerRepository: PlayerRepository;

  constructor(input: Dependencies) {
    this.playerRepository = input.playerRepository;
  }

  async handle(input: CreditPlayerAccountCommand): Promise<void> {
    const { payload } = input;
    const player = await this.playerRepository.findById(payload.playerId);
    player.account.credit(payload.amount);
    await this.playerRepository.update(player);
  }
}
