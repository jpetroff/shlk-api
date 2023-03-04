import * as _ from 'underscore'

export type SnoozeDay = {
  day?: number
  dayInc?: number
  month?: number
  monthInc?: number
  year?: number
  yearInc?: number
  weekday?: Weekdays
  date?: number
}

export type SnoozeTime = {
  timeInc?: [number, number]
  daytime?: [number, number]
}

export enum Weekdays {
  Sun = 0,
  Mon = 1,
  Tue = 2,
  Wed = 3,
  Thu = 4,
  Fri = 5,
  Sat = 6
}

export enum StandardTimers {
  tomorrow_morning = 'tomorrow_morning',
  tomorrow_evening = 'tomorrow_evening',
  tomorrow_afternoon = 'tomorrow_afternoon',
  evening = 'today_evening',
  afternoon = 'today_afternoon',
  nextMonday = 'monday_morning',
  nextWeekend = 'saturday_afternoon',
  nextMonth = 'nextmonth_morning',
  inMonth = 'inmonth_morning',
  later = 'today_later',
  inHour = 'today_hour',
  someday = 'random_afternoon'
}

class SnoozeTools {
  
  public Days : { [key: string]: SnoozeDay } = {
    'today': { dayInc: 0},
    'tomorrow': { dayInc: 1},
    'monday': { weekday: Weekdays.Mon},
    'saturday': { weekday: Weekdays.Sat},
    'inmonth': { monthInc: 1 },
    'nextmonth': { monthInc: 1, day: 1 },
    'random': {}
  }

  public Times: { [key: string]: SnoozeTime } = {
    'morning': { daytime: [9, 0] },
    'afternoon': { daytime: [13, 0] },
    'evening': { daytime: [20, 0] },
    'later': { timeInc: [3, 0] },
    'hour': { timeInc: [1, 0] },
  }

  constructor() {

  }

  getStandardSnooze(snooze: StandardTimers, baseDate: Date = new Date()) : Date {
    const [dateParamName, timeParamName] = snooze.split('_')
    const dateParam = dateParamName == 'random' ? 
      { monthInc: 3, dayInc: Math.floor(Math.random() * 30)} : this.Days[dateParamName]
    const timeParam = this.Times[timeParamName]
    return this.getCustomSnooze(dateParam, timeParam)
  }

  getCustomSnooze(date: SnoozeDay, time: SnoozeTime, baseDate: Date = new Date()) : Date {
    return this.setTime(
      this.setDay(
        baseDate,
        date
      ),
    time)
  }

  getStandardDescription(snooze: StandardTimers) : string {
    switch(snooze) {
      case StandardTimers.tomorrow_morning: return 'Tomorrow morning'
      case StandardTimers.tomorrow_evening: return 'Tomorrow evening'
      case StandardTimers.tomorrow_afternoon: return 'Tomorrow afternoon'
      case StandardTimers.evening: return 'This evening'
      case StandardTimers.afternoon: return 'This afternoon'
      case StandardTimers.nextMonday: return 'Next monday'
      case StandardTimers.nextWeekend: return 'Next weekend'
      case StandardTimers.nextMonth: return 'Next month'
      case StandardTimers.inMonth: return 'In a month'
      case StandardTimers.later: return 'Later today'
      case StandardTimers.inHour: return 'In an hour'
      case StandardTimers.someday: return 'Someday'
      default: return ''
    }
  }

  setDay(base: Date, params: SnoozeDay) : Date {
    if(params.date) return new Date(params.date)

    const now = new Date()
    const month = params.month || (now.getMonth() + (params.monthInc || 0) )
    const day = this.calcDay(params)
    const year = params.year || (now.getFullYear() + (params.yearInc || 0) )
    base.setDate(day)
    base.setMonth(month)
    base.setFullYear(year)
    base.setHours(0,0,0,0)
    return base
  }

  setTime(base: Date, params: SnoozeTime) : Date {
    const now = new Date()
    if(params.timeInc) {
      base.setHours(now.getHours() + params.timeInc[0], now.getMinutes() + params.timeInc[1])
      return base
    } else if (params.daytime) {
      base.setHours(params.daytime[0], params.daytime[1])
      return base
    } else {
      return base
    }
  }

  private calcDay(params: SnoozeDay) : number {
    const now = new Date()
    if(params.day != undefined || params.dayInc != undefined) {
      return params.day || (now.getDate() + (params.dayInc || 0) )
    } else if(params.weekday != undefined ) {
      const dayDiff = params.weekday - now.getDate()
      const dayInc = dayDiff <= 0 ? dayDiff + 6 : dayDiff
      return dayInc
    } else {
      return now.getDate()
    }
  }
}

export default new SnoozeTools()