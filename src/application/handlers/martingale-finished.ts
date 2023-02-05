import { Handler } from "./handler";
import { Mailer } from "../ports/gateways/mailer";
import { MartingaleFinishedEvent } from "../events/martingale-finished";
import { MartingaleRepository } from "../ports/repositories/martingale";
import { PlayerRepository } from "../ports/repositories/player";

type Dependencies = {
  playerRepository: PlayerRepository;
  martingaleRepository: MartingaleRepository;
  mailer: Mailer;
};

export class MartingaleFinishedHandler implements Handler {
  name = "martingale-finished";
  playerRepository: PlayerRepository;
  martingaleRepository: MartingaleRepository;
  mailer: Mailer;

  constructor(input: Dependencies) {
    this.playerRepository = input.playerRepository;
    this.martingaleRepository = input.martingaleRepository;
    this.mailer = input.mailer;
  }

  async handle(event: MartingaleFinishedEvent): Promise<void> {
    const { payload } = event;
    const player = await this.playerRepository.findById(payload.playerId);
    const history = await this.martingaleRepository.findHistory(payload.martingaleId);
    const balance = history.reduce((acc, curr) => acc + curr.profit, 0);
    await this.mailer.sendMail(player.email, "Martingale Finished", JSON.stringify({ history, balance }));
  }
}
