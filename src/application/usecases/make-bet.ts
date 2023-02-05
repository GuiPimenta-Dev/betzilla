import { AccountRepository } from "../ports/repositories/account";
import { BetGateway } from "../ports/gateways/bet";
import { BetMadeEvent } from "../events/bet-made";
import { Broker } from "../ports/brokers/broker";

type Dependencies = {
  accountRepository: AccountRepository;
  betGateway: BetGateway;
  broker: Broker;
};

type Input = {
  accountId: string;
  betValue: number;
  betId: string;
};

export class MakeBet {
  private accountRepository: AccountRepository;
  private betGateway: BetGateway;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.accountRepository = input.accountRepository;
    this.betGateway = input.betGateway;
    this.broker = input.broker;
  }

  async execute(input: Input): Promise<void> {
    const account = await this.accountRepository.findById(input.accountId);
    await this.betGateway.makeBet(input.betValue);
    account.debit(input.betValue);
    await this.accountRepository.update(account);
    const event = new BetMadeEvent({ ...input });
    await this.broker.publish(event);
  }
}
