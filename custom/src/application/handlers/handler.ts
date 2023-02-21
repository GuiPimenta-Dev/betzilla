import { Command } from "../../domain/commands/command";
import { Event } from "../../domain/events/event";

export interface Handler {
  name: string;
  handle(input: Command | Event): Promise<void>;
}
