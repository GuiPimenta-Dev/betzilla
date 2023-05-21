import { Event } from "./event";

type Input = {
  botId: string;
  market: string;
};

export class BotCreated extends Event {
  constructor(payload: Input) {
    super("bot-created", payload);
  }
}
