import { Handler } from "../../../src/application/handlers/handler";
import { Broker } from "../../../src/application/ports/brokers/broker";
import { BetLost } from "../../../src/domain/events/bet-lost";
import { BetVerified } from "../../../src/domain/events/bet-verified";
import { BetWon } from "../../../src/domain/events/bet-won";

type Dependencies = {
  broker: Broker;
};

export class VerifyBetStub implements Handler {
  name = "verify-bet";
  broker: Broker;
  events: BetWon | BetLost[];
  eventIndex: number = 0;

  constructor(input: Dependencies) {
    this.broker = input.broker;
  }

  async handle(): Promise<void> {
    const event = this.events[this.eventIndex];
    if (!event) return;
    await this.broker.publish(event);
    await this.broker.publish(new BetVerified(event.payload));
    this.eventIndex++;
  }

  setEvents(events: BetWon | BetLost[]) {
    this.events = events;
  }
}
