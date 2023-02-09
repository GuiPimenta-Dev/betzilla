import { Command } from "../../application/commands/command";
import { Event } from "../../application/events/event";
import { Handler } from "../../application/handlers/handler";
import { Broker } from "../../application/ports/brokers/broker";

export class InMemoryBroker implements Broker {
  handlers: Handler[];

  constructor() {
    this.handlers = [];
  }

  register(handler: Handler) {
    this.handlers.push(handler);
  }

  async publish(input: Command | Event): Promise<void> {
    this.handlers.map(async (handler) => {
      if (handler.name === input.name) {
        await handler.handle(input);
      }
    });
  }

  async schedule(input: Command): Promise<void> {
    await this.publish(input);
  }
}
