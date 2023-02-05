import { Command } from "../../commands/command";
import { Event } from "../../events/event";
import { Handler } from "../../handlers/handler";

export interface Broker {
  handlers: any[];
  register(handler: Handler): void;
  publish(action: Command | Event): Promise<void>;
  schedule(command: Command): Promise<void>;
}
