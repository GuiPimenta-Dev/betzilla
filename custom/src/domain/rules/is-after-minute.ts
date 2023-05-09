import moment from 'moment';
import { Match } from '../entities/match';
import { Rule } from "./rule";

export class IsAfterMinute implements Rule{

    constructor(private match: Match, private minute: number) {
    }

    shouldBet(): boolean {
        const matchStartTime = moment(this.match.date);
        const now = moment();
        const minutesSinceMatchStarted = now.diff(matchStartTime, "minutes");
        return minutesSinceMatchStarted >= this.minute;
    }

}