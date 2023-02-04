import { AccountRepository } from "../ports/repositories/account";
import { BetGateway } from "../ports/gateways/bet";
import { Broker } from "../ports/brokers/broker";
import { StartMartingale } from "../commands/start-martingale";

type Dependencies = {
  accountRepository: AccountRepository;
  betGateway: BetGateway;
  broker: Broker;
};

export class StartMartingaleHandler {
  name = "start-martingale";
  private accountRepository: AccountRepository;
  private betGateway: BetGateway;
  private broker: Broker;

  constructor(input: Dependencies) {
    this.accountRepository = input.accountRepository;
    this.betGateway = input.betGateway;
    this.broker = input.broker;
  }

  async handle(command: StartMartingale) {
    const { payload } = command;
    const account = await this.accountRepository.findById(payload.accountId);
    account.debit(command.payload.initialBet);
    await this.accountRepository.update(account);
  }
}
