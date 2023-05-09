import { Strategy } from "../entities/strategy";
import { Event } from "./event";

export class ExecutionStarted extends Event {
  constructor(payload: Strategy) {
    super("execution-started", payload);
  }
}
