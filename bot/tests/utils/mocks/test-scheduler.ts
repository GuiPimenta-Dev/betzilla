import moment from "moment";
import { Scheduler } from "../../../src/application/ports/scheduler/scheduler";

export class TestScheduler implements Scheduler {
  timeToFirstHalfFinish(date: string): Date {
    const now = moment(date).toDate();
    return now;
  }

  timeToMatchFinish(date: string): Date {
    const now = moment(date).toDate();
    return now;
  }

  timeToVerifyOdds(): Date {
    const now = moment().toDate();
    return now;
  }

  timeToVerifyBet(): Date {
    const now = moment().toDate();
    return now;
  }
}
