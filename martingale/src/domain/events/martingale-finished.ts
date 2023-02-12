import { Event } from "./event";

type Input = {
  martingaleId: string;
  reason: string;
};

export class MartingaleFinished extends Event {
  constructor(payload: Input) {
    super("martingale-finished", payload);
  }
}
