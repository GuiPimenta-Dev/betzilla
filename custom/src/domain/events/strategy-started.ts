import { StrategyInfo } from "../../application/ports/repositories/strategy";
import { Event } from "./event";

export class StrategyStarted extends Event {
  constructor(payload: StrategyInfo) {
    super("strategy-started", payload);
  }
}
