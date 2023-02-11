import { Command } from "../../../domain/commands/command";
import { Event } from "../../../domain/events/event";
import { Handler } from "../../handlers/handler";

export interface Broker {
  handlers: Handler[];
  register(handler: Handler): void;
  connect(): Promise<void>;
  close(): Promise<void>;
  subscribe(handler: Handler, callback: Function): Promise<void>;
  publish(input: Command | Event): Promise<void>;
  schedule(input: Command): Promise<void>;
}
