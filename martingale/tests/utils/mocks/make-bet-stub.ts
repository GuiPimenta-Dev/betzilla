import { Handler } from "../../../src/application/handlers/handler";
import { Broker } from "../../../src/application/ports/brokers/broker";
import { BetMade } from "../../../src/domain/events/bet-made";
import { BetNotMade } from "../../../src/domain/events/bet-not-made";

type Dependencies = {
  broker: Broker;
};

export class MakeBetStub implements Handler {
  name = "make-bet";
  broker: Broker;
  events: (BetMade | BetNotMade)[];
  eventIndex: number = 0;

  constructor(input: Dependencies) {
    this.broker = input.broker;
  }

  async handle(): Promise<void> {
    const event = this.events[this.eventIndex];
    this.eventIndex++;
    await this.broker.publish(event);
  }

  setEvents(events: (BetMade | BetNotMade)[]) {
    this.events = events;
  }
}
