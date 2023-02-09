import { v4 as uuid } from "uuid";
import { MakeMartingaleBetCommand } from "../../../domain/commands/martingale/make-martingale-bet";
import { Martingale } from "../../../domain/entities/martingale/martingale";
import { BadRequest } from "../../../utils/http-status/bad-request";
import { Broker } from "../../ports/brokers/broker";
import { MartingaleRepository } from "../../ports/repositories/martingale";

type Dependencies = {
  martingaleRepository: MartingaleRepository;
  broker: Broker;
};

type Input = {
  playerId: string;
  initialBet: number;
  rounds: number;
  multiplier: number;
};

export class StartMartingale {
  private martingaleRepository: MartingaleRepository;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
    this.broker = input.broker;
  }

  async execute(input: Input): Promise<{ martingaleId: string }> {
    if (input.rounds < 1) throw new BadRequest("There must be at least one round");
    const martingale = new Martingale({ id: uuid(), ...input });
    await this.martingaleRepository.create(martingale);
    const command = new MakeMartingaleBetCommand({ martingaleId: martingale.id, playerId: martingale.playerId });
    await this.broker.publish(command);
    return { martingaleId: martingale.id };
  }
}
