export interface Scheduler {
  timeToFirstHalfFinish(date: string): Date;
  timeToMatchFinish(date: string): Date;
  timeToVerifyOdds(): Date;
  timeToVerifyBet(): Date;
}
