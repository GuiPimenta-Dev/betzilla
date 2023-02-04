import { Command } from "../commands/command";

export interface Handler {
  name: string;
  handle(command: Command): Promise<void>;
}
