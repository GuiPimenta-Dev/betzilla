import { Handler } from "../../../src/application/handlers/handler";
import { Broker } from "../../../src/application/ports/brokers/broker";
import { BetMade } from "../../../src/domain/events/bet-made";

type Dependencies = {
  broker: Broker;
};

export class MakeBetStub implements Handler {
  name = "make-bet";
  broker: Broker;
  events: BetMade[];
  eventIndex: number = 0;

  constructor(input: Dependencies) {
    this.broker = input.broker;
  }

  async handle(): Promise<void> {
    const event = this.events[this.eventIndex];
    await this.broker.publish(event);
    this.eventIndex++;
  }

  setEvents(events: BetMade[]) {
    this.events = events;
  }
}
