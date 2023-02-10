import { Command } from "./command";

type Payload = {
  betId: string;
  subject: string;
  body: string;
};

export class SendEmail extends Command {
  constructor(payload: Payload) {
    super("send-email", payload);
  }
}
