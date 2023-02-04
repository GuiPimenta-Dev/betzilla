import { Broker } from "../../../src/application/ports/brokers/broker";
import { Event } from "../../../src/application/events/event";
import { Handler } from "../../../src/application/handlers/handler";

export class BrokerSpy implements Broker {
  handlers: Handler[];
  events: Event[];

  constructor() {
    this.handlers = [];
    this.events = [];
  }

  register(handler: Handler) {
    this.handlers.push(handler);
  }

  publish(event: Event): void {
    this.events.push(event);
  }
}
