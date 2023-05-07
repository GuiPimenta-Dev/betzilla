import { Rule } from "../entities/rule";
import { Event } from "./event";

export class ExecutionStarted extends Event {
  constructor(payload: Rule) {
    super("execution-started", payload);
  }
}
