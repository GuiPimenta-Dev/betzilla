import { SendEmail } from "../../domain/commands/send-email";
import { MartingaleFinished } from "../../domain/events/martingale-finished";
import { Broker } from "../ports/brokers/broker";
import { MartingaleRepository } from "../ports/repositories/martingale";
import { GetHistory } from "../usecases/get-history";
import { Handler } from "./handler";

type Dependencies = {
  martingaleRepository: MartingaleRepository;
  broker: Broker;
};

export class MartingaleFinishedHandler implements Handler {
  name = "martingale-finished";
  martingaleRepository: MartingaleRepository;
  broker: Broker;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
    this.broker = input.broker;
  }

  async handle(event: MartingaleFinished): Promise<void> {
    const { payload } = event;
    const martingale = await this.martingaleRepository.findById(payload.martingaleId);
    martingale.status = payload.status;
    await this.martingaleRepository.update(martingale);
    const usecase = new GetHistory({ martingaleRepository: this.martingaleRepository });
    const history = await usecase.execute(payload.martingaleId);
    await this.broker.publish(
      new SendEmail({
        playerId: martingale.playerId,
        subject: "Martingale Finished",
        body: JSON.stringify(history),
      })
    );
  }
}
