import { Broker } from "../../application/ports/brokers/broker";
import { Event } from "../../application/events/event";
import { Handler } from "../../application/handlers/handler";

export class InMemoryBroker implements Broker {
  handlers: Handler[];

  constructor() {
    this.handlers = [];
  }

  register(handler: Handler) {
    this.handlers.push(handler);
  }

  publish(action: Event): void {
    this.handlers.forEach(async (handler) => {
      if (handler.name === action.name) {
        handler.handle(action);
      }
    });
  }
}
