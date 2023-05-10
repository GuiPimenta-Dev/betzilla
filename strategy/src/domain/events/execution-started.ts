import { Event } from "./event";

type Input = {
  strategyId: string;
  market: string;
};

export class ExecutionStarted extends Event {
  constructor(payload: Input) {
    super("execution-started", payload);
  }
}
