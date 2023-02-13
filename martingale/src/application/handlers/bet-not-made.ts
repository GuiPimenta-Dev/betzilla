import { MakeBet } from "../../domain/commands/make-bet";
import { BetNotMade } from "../../domain/events/bet-not-made";
import { MartingaleFinished } from "../../domain/events/martingale-finished";
import { Broker } from "../ports/brokers/broker";
import { Handler } from "./handler";

type Dependencies = {
  broker: Broker;
};

export class BetNotMadeHandler implements Handler {
  name = "bet-not-made";
  broker: Broker;
  constructor(input: Dependencies) {
    this.broker = input.broker;
  }

  async handle(event: BetNotMade): Promise<void> {
    const { payload } = event;
    try {
      payload.retry();
    } catch {
      await this.broker.publish(
        new MartingaleFinished({ martingaleId: payload.strategy.id, status: "max attempts reached" })
      );
      return;
    }
    await this.broker.schedule(new MakeBet(payload));
  }
}
