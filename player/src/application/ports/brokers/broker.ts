import { Command } from "../../../domain/commands/command";
import { Event } from "../../../domain/events/event";
import { Handler } from "../../handlers/handler";

export interface Broker {
  handlers: Handler[];
  connect(): Promise<void>;
  close(): Promise<void>;
  register(handler: Handler): void;
  subscribe(handler: Handler, callback: Function): void;
  publish(input: Command | Event): Promise<void>;
  schedule(input: Command): Promise<void>;
}
