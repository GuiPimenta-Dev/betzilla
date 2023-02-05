import { MakeMartingaleBetCommand } from "../commands/make-martingale-bet";
import { VerifyMartingaleCommand } from "../commands/verify-martingale";
import { MartingaleVerifiedEvent } from "../events/martingale-verified";
import { Broker } from "../ports/brokers/broker";
import { Handler } from "./handler";

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
    if (payload.status === "pending") await this.scheduleVerifyMartingaleCommand(payload);
    if (payload.status !== "pending") await this.publishMakeMartingaleBetCommand(payload);
  }

  private async scheduleVerifyMartingaleCommand(payload: MartingaleVerifiedEvent["payload"]) {
    const commandPayload = { id: payload.betId };
    const command = new VerifyMartingaleCommand(commandPayload);
    await this.broker.schedule(command);
  }

  private async publishMakeMartingaleBetCommand(payload: MartingaleVerifiedEvent["payload"]) {
    const commandPayload = { id: payload.betId, playerId: payload.playerId };
    const command = new MakeMartingaleBetCommand(commandPayload);
    await this.broker.publish(command);
  }
}
