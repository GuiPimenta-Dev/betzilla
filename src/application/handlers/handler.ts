import { Command } from "../commands/command";
import { Event } from "../events/event";

export interface Handler {
  name: string;
  handle(command: Command | Event): Promise<void>;
}
