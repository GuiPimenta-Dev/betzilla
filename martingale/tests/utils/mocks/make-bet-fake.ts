import { Handler } from "../../../src/application/handlers/handler";
import { Broker } from "../../../src/application/ports/brokers/broker";
import { MakeBet } from "../../../src/domain/commands/make-bet";
import { BetMade } from "../../../src/domain/events/bet-made";

type Dependencies = {
  broker: Broker;
};

export class MakeBetFake implements Handler {
  name = "make-bet";
  broker: Broker;

  constructor(input: Dependencies) {
    this.broker = input.broker;
  }

  async handle(input: MakeBet): Promise<void> {
    const { payload } = input;
    await this.broker.publish(new BetMade({ ...payload }));
  }
}
