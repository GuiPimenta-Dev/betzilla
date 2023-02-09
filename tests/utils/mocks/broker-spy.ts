import { Command } from "../../../src/application/commands/command";
import { Event } from "../../../src/application/events/event";
import { Handler } from "../../../src/application/handlers/handler";
import { Broker } from "../../../src/application/ports/brokers/broker";

export class BrokerSpy implements Broker {
  handlers: Handler[] = [];
  events: Event[] = [];
  commands: Command[] = [];
  scheduledCommands: Command[] = [];
  history: string[] = [];
  broker: Broker;

  constructor(broker: Broker) {
    this.broker = broker;
  }

  register(handler: Handler) {
    this.broker.register(handler);
  }

  async publish(input: Event | Command): Promise<void> {
    if (input instanceof Event) this.events.push(input);
    if (input instanceof Command) this.commands.push(input);
    this.history.push(input.name);
    await this.broker.publish(input);
  }

  async schedule(input: Command): Promise<void> {
    this.scheduledCommands.push(input);
    this.history.push(input.name);
    await this.broker.schedule(input);
  }
}
