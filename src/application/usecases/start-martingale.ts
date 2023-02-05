import { v4 as uuid } from "uuid";
import { Martingale } from "../../domain/martingale";
import { MakeMartingaleBetCommand } from "../commands/make-martingale-bet";
import { Broker } from "../ports/brokers/broker";
import { MartingaleRepository } from "../ports/repositories/martingale";
import { PlayerRepository } from "../ports/repositories/player";

type Dependencies = {
  playerRepository: PlayerRepository;
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
  private playerRepository: PlayerRepository;
  private martingaleRepository: MartingaleRepository;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.playerRepository = input.playerRepository;
    this.martingaleRepository = input.martingaleRepository;
    this.broker = input.broker;
  }

  async execute(input: Input): Promise<{ martingaleId: string }> {
    const player = await this.playerRepository.findById(input.playerId);
    if (player.account.balance < input.initialBet) throw new Error("Insufficient Funds");
    const martingale = new Martingale({ id: uuid(), ...input });
    await this.martingaleRepository.create(martingale);
    const commandPayload = { id: martingale.id, playerId: input.playerId, betValue: input.initialBet };
    const command = new MakeMartingaleBetCommand(commandPayload);
    await this.broker.publish(command);
    return { martingaleId: martingale.id };
  }
}
