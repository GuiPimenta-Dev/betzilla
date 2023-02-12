import { DebitFailed } from "../../domain/events/debit-failed";
import { MartingaleFinished } from "../../domain/events/martingale-finished";
import { Broker } from "../ports/brokers/broker";
import { Handler } from "./handler";

type Dependencies = {
  broker: Broker;
};

export class DebitFailedHandler implements Handler {
  name = "debit-failed";
  broker: Broker;

  constructor(input: Dependencies) {
    this.broker = input.broker;
  }

  async handle(input: DebitFailed): Promise<void> {
    const { payload } = input;
    await this.broker.publish(
      new MartingaleFinished({ martingaleId: payload.strategy.id, reason: "not enough funds" })
    );
  }
}
