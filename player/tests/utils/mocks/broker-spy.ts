import { Broker } from "../../../src/application/ports/brokers/broker";
import { Command } from "../../../src/domain/commands/command";
import { Event } from "../../../src/domain/events/event";
import { Handler } from "../../../src/application/handlers/handler";

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

  async connect(): Promise<void> {}

  subscribe(handler: Handler): void {
    this.broker.subscribe(handler, jest.fn());
  }

  async publish(input: Event | Command): Promise<void> {
    if (input instanceof Event) this.events.push(input);
    if (input instanceof Command) this.commands.push(input);
    this.history.push(input.name);
    await this.broker.publish(input);
  }

  async schedule(input: Command, date: Date): Promise<void> {
    this.scheduledCommands.push(input);
    this.history.push(input.name);
    await this.broker.schedule(input, null);
  }
}
