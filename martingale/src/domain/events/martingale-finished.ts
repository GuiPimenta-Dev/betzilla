import { Event } from "./event";

type Input = {
  martingaleId: string;
  status: string;
};

export class MartingaleFinished extends Event {
  constructor(payload: Input) {
    super("martingale-finished", payload);
  }
}
