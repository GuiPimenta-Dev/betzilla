import { Broker } from "../ports/brokers/broker";
import { Handler } from "./handler";
import { MakeMartingaleBetCommand } from "../commands/make-martingale-bet";
import { MartingaleVerifiedEvent } from "../events/martingale-verified";
import { VerifyMartingaleCommand } from "../commands/verify-martingale";

type Dependencies = {
  broker: Broker;
};

export class MartingaleVerifiedHandler implements Handler {
  name = "martingale-verified";
  broker: Broker;

  constructor(input: Dependencies) {
    this.broker = input.broker;
  }

  async handle(input: MartingaleVerifiedEvent): Promise<void> {
    const { payload } = input;
    if (payload.status === "pending") this.broker.schedule(new VerifyMartingaleCommand({ id: payload.betId }));
    if (payload.status !== "pending")
      this.broker.publish(new MakeMartingaleBetCommand({ id: payload.betId, playerId: payload.playerId }));
  }
}
