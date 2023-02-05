import { Broker } from "../../../src/application/ports/brokers/broker";
import { Command } from "../../../src/application/commands/command";
import { Event } from "../../../src/application/events/event";
import { Handler } from "../../../src/application/handlers/handler";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";

export class BrokerSpy implements Broker {
  handlers: Handler[] = [];
  events: Event[] = [];
  commands: Command[] = [];
  scheduledCommands: Command[] = [];
  actions: string[] = [];
  broker: Broker;

  constructor(broker: Broker = new InMemoryBroker()) {
    this.broker = broker;
  }

  register(handler: Handler) {
    this.broker.register(handler);
  }

  async publish(action: Event | Command): Promise<void> {
    if (action instanceof Event) this.events.push(action);
    if (action instanceof Command) this.commands.push(action);
    this.actions.push(action.name);
    await this.broker.publish(action);
  }

  async schedule(command: Command): Promise<void> {
    this.scheduledCommands.push(command);
    this.actions.push(command.name);
    await this.broker.schedule(command);
  }
}
