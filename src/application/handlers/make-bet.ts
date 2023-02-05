import { AccountRepository } from "../ports/repositories/account";
import { BetGateway } from "../ports/gateways/bet";
import { Broker } from "../ports/brokers/broker";
import { MakeBet } from "../usecases/make-bet";
import { MakeBetCommand } from "../commands/make-bet";

type Dependencies = {
  accountRepository: AccountRepository;
  betGateway: BetGateway;
  broker: Broker;
};

export class MakeBetHandler {
  name = "make-bet";
  private broker: Broker;
  private accountRepository: AccountRepository;
  private betGateway: BetGateway;

  constructor(input: Dependencies) {
    this.accountRepository = input.accountRepository;
    this.betGateway = input.betGateway;
    this.broker = input.broker;
  }

  async handle(input: MakeBetCommand) {
    const { payload } = input;
    const usecase = new MakeBet({
      accountRepository: this.accountRepository,
      betGateway: this.betGateway,
      broker: this.broker,
    });
    await usecase.execute(payload);
  }
}
