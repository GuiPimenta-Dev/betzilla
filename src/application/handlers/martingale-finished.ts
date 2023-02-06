import { MartingaleFinishedEvent } from "../events/martingale-finished";
import { Mailer } from "../ports/gateways/mailer";
import { MartingaleRepository } from "../ports/repositories/martingale";
import { PlayerRepository } from "../ports/repositories/player";
import { GetMartingaleHistory } from "../usecases/get-martingale-history";
import { Handler } from "./handler";
import  from "../usecases/get-martingale-history";

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
    const usecase = new GetMartingaleHistory({ martingaleRepository: this.martingaleRepository });
    const history = await usecase.execute(payload.martingaleId);
    await this.mailer.sendMail(player.email, "Martingale Finished", JSON.stringify(history));
  }
}
