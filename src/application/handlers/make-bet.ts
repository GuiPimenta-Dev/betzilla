import { MakeBetCommand } from "../commands/make-bet";
import { Broker } from "../ports/brokers/broker";
import { BetGateway } from "../ports/gateways/bet";
import { MakeBet } from "../usecases/make-bet";

type Dependencies = {
  betGateway: BetGateway;
  broker: Broker;
};

export class MakeBetHandler {
  name = "make-bet";
  private broker: Broker;
  private betGateway: BetGateway;

  constructor(input: Dependencies) {
    this.betGateway = input.betGateway;
    this.broker = input.broker;
  }

  async handle(input: MakeBetCommand) {
    const { payload } = input;
    const usecase = new MakeBet({
      betGateway: this.betGateway,
      broker: this.broker,
    });
    await usecase.execute(payload);
  }
}
