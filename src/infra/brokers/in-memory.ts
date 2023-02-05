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

  async publish(action: Event): Promise<void> {
    this.handlers.map(async (handler) => {
      if (handler.name === action.name) {
        await handler.handle(action);
      }
    });
  }
}
