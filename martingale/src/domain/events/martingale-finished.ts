import { Event } from "./event";

type Input = {
  martingaleId: string;
};

export class MartingaleFinished extends Event {
  constructor(payload: Input) {
    super("martingale-finished", payload);
  }
}
