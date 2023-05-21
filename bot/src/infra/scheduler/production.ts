import moment from "moment";
import { Scheduler } from "../../application/ports/scheduler/scheduler";

export class ProductionScheduler implements Scheduler {
  timeToFirstHalfFinish(date: string): Date {
    const fourtyFiveMinutesLater = moment(date).add(45, "minutes").toDate();
    return fourtyFiveMinutesLater;
  }

  timeToMatchFinish(date: string): Date {
    const ninetyMinutesLater = moment(date).add(90, "minutes").toDate();
    return ninetyMinutesLater;
  }

  timeToVerifyOdds(): Date {
    const fiveMinutesLater = moment().add(5, "minutes").toDate();
    return fiveMinutesLater;
  }

  timeToVerifyBet(): Date {
    const fifteenMinutesLater = moment().add(15, "minutes").toDate();
    return fifteenMinutesLater;
  }
}
