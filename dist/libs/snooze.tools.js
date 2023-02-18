"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardTimers = exports.Weekdays = void 0;
var Weekdays;
(function (Weekdays) {
    Weekdays[Weekdays["Sun"] = 0] = "Sun";
    Weekdays[Weekdays["Mon"] = 1] = "Mon";
    Weekdays[Weekdays["Tue"] = 2] = "Tue";
    Weekdays[Weekdays["Wed"] = 3] = "Wed";
    Weekdays[Weekdays["Thu"] = 4] = "Thu";
    Weekdays[Weekdays["Fri"] = 5] = "Fri";
    Weekdays[Weekdays["Sat"] = 6] = "Sat";
})(Weekdays = exports.Weekdays || (exports.Weekdays = {}));
var StandardTimers;
(function (StandardTimers) {
    StandardTimers["tomorrow_morning"] = "tomorrow_morning";
    StandardTimers["tomorrow_evening"] = "tomorrow_evening";
    StandardTimers["tomorrow_afternoon"] = "tomorrow_afternoon";
    StandardTimers["evening"] = "today_evening";
    StandardTimers["afternoon"] = "today_afternoon";
    StandardTimers["nextMonday"] = "monday_morning";
    StandardTimers["nextWeekend"] = "saturday_afternoon";
    StandardTimers["nextMonth"] = "nextmonth_morning";
    StandardTimers["inMonth"] = "inmonth_morning";
    StandardTimers["later"] = "today_later";
    StandardTimers["inHour"] = "today_hour";
})(StandardTimers = exports.StandardTimers || (exports.StandardTimers = {}));
class SnoozeTools {
    Days = {
        'today': { dayInc: 0 },
        'tomorrow': { dayInc: 1 },
        'monday': { weekday: Weekdays.Mon },
        'saturday': { weekday: Weekdays.Sat },
        'inmonth': { monthInc: 1 },
        'nextmonth': { monthInc: 1, day: 1 }
    };
    Times = {
        'morning': { daytime: [9, 0] },
        'afternoon': { daytime: [13, 0] },
        'evening': { daytime: [20, 0] },
        'later': { timeInc: [3, 0] },
        'hour': { timeInc: [1, 0] },
    };
    constructor() {
    }
    getStandardSnooze(snooze) {
        const [dateParamName, timeParamName] = snooze.split('_');
        const dateParam = this.Days[dateParamName];
        const timeParam = this.Times[timeParamName];
        return this.getCustomSnooze(dateParam, timeParam);
    }
    getCustomSnooze(date, time) {
        return this.setTime(this.setDay(new Date(), date), time);
    }
    getStandardDescription(snooze) {
        switch (snooze) {
            case StandardTimers.tomorrow_morning: return 'Tomorrow morning';
            case StandardTimers.tomorrow_evening: return 'Tomorrow evening';
            case StandardTimers.tomorrow_afternoon: return 'Tomorrow afternoon';
            case StandardTimers.evening: return 'This evening';
            case StandardTimers.afternoon: return 'This afternoon';
            case StandardTimers.nextMonday: return 'Next monday';
            case StandardTimers.nextWeekend: return 'Next weekend';
            case StandardTimers.nextMonth: return 'Next month';
            case StandardTimers.inMonth: return 'In a month';
            case StandardTimers.later: return 'Later today';
            case StandardTimers.inHour: return 'In an hour';
            default: return '';
        }
    }
    setDay(base, params) {
        if (params.date)
            return new Date(params.date);
        const now = new Date();
        const month = params.month || (now.getMonth() + (params.monthInc || 0));
        const day = this.calcDay(params);
        const year = params.year || (now.getFullYear() + (params.yearInc || 0));
        base.setDate(day);
        base.setMonth(month);
        base.setFullYear(year);
        base.setHours(0, 0, 0, 0);
        return base;
    }
    setTime(base, params) {
        const now = new Date();
        if (params.timeInc) {
            base.setHours(now.getHours() + params.timeInc[0], now.getMinutes() + params.timeInc[1]);
            return base;
        }
        else if (params.daytime) {
            base.setHours(params.daytime[0], params.daytime[1]);
            return base;
        }
        else {
            return base;
        }
    }
    calcDay(params) {
        const now = new Date();
        if (params.day != undefined || params.dayInc != undefined) {
            return params.day || (now.getDate() + (params.dayInc || 0));
        }
        else if (params.weekday != undefined) {
            const dayDiff = params.weekday - now.getDate();
            const dayInc = dayDiff <= 0 ? dayDiff + 6 : dayDiff;
            return dayInc;
        }
        else {
            return now.getDate();
        }
    }
}
exports.default = new SnoozeTools();
//# sourceMappingURL=snooze.tools.js.map