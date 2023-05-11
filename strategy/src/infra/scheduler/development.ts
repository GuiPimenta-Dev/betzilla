import { Scheduler } from "../../application/ports/scheduler/scheduler";
import moment from "moment";

export class DevelopmentScheduler implements Scheduler {
  timeToFirstHalfFinish(date: string): Date {
    const fiveSecondsLater = moment(date).add(5, "seconds").toDate();
    return fiveSecondsLater;
  }

  timeToMatchFinish(date: string): Date {
    const tenSecondsLater = moment(date).add(10, "seconds").toDate();
    return tenSecondsLater;
  }

  timeToVerifyOdds(): Date {
    const oneSecondLater = moment().add(1, "seconds").toDate();
    return oneSecondLater;
  }

  timeToVerifyBet(): Date {
    const fiveSecondsLater = moment().add(5, "seconds").toDate();
    return fiveSecondsLater;
  }
}
