import { Broker } from "../../../src/application/ports/brokers/broker";
import { Command } from "../../../src/application/commands/command";
import { Event } from "../../../src/application/events/event";
import { Handler } from "../../../src/application/handlers/handler";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";

export class BrokerSpy implements Broker {
  handlers: Handler[] = [];
  events: Event[] = [];
  commands: Command[] = [];
  broker: Broker;

  constructor(broker: Broker = new InMemoryBroker()) {
    this.broker = broker;
  }

  register(handler: Handler) {
    this.broker.register(handler);
  }

  async publish(input: Event | Command): Promise<void> {
    if (input instanceof Event) this.events.push(input);
    if (input instanceof Command) this.commands.push(input);
    await this.broker.publish(input);
  }
}
