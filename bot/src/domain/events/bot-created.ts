import { Event } from "./event";

type Input = {
  botId: string;
  marketId: number;
};

export class BotCreated extends Event {
  constructor(payload: Input) {
    super("bot-created", payload);
  }
}
