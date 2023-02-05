import { AccountRepository } from "../ports/repositories/account";
import { Broker } from "../ports/brokers/broker";
import { MakeMartingaleBetCommand } from "../commands/make-martingale-bet";
import { Martingale } from "../../domain/martingale";
import { MartingaleRepository } from "../ports/repositories/martingale";
import { v4 as uuid } from "uuid";

type Dependencies = {
  accountRepository: AccountRepository;
  martingaleRepository: MartingaleRepository;
  broker: Broker;
};

type Input = {
  accountId: string;
  initialBet: number;
  rounds: number;
  multiplier: number;
};

export class StartMartingale {
  private accountRepository: AccountRepository;
  private martingaleRepository: MartingaleRepository;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.accountRepository = input.accountRepository;
    this.martingaleRepository = input.martingaleRepository;
    this.broker = input.broker;
  }

  async execute(input: Input) {
    const account = await this.accountRepository.findById(input.accountId);
    if (account.balance < input.initialBet) throw new Error("Insufficient Funds");
    const martingale = new Martingale({ id: uuid(), ...input });
    await this.martingaleRepository.create(martingale);
    const commandPayload = { id: martingale.id, accountId: input.accountId, betValue: input.initialBet };
    const command = new MakeMartingaleBetCommand(commandPayload);
    await this.broker.publish(command);
  }
}
