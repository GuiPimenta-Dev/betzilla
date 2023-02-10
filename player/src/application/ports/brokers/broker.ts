import { Command } from "../../../domain/commands/command";
import { Event } from "../../../domain/events/event";
import { Handler } from "../../handlers/handler";

export interface Broker {
  handlers: Handler[];
  register(handler: Handler): void;
  publish(input: Command | Event): Promise<void>;
  schedule(input: Command): Promise<void>;
}
