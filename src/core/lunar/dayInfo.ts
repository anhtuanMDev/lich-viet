import { auspiciousHoursOf, dayQualityOf } from './auspicious';
import { dayCanChi, monthCanChi, yearCanChi } from './canChi';
import { jdToLunar } from './converter';
import { holidaysOf } from './holidays';
import type { Holiday } from './holidays';
import { addDays, fromJulianDay, toJulianDay, weekdayOf } from './julian';
import { solarTermOf } from './solarTerm';
import type {
  AuspiciousHour,
  CanChi,
  DayQuality,
  JulianDay,
  LunarDate,
  SolarDate,
  SolarTermInfo,
  Weekday,
} from './types';

/** Thông tin rút gọn cho một ô lịch – đủ rẻ để tính hàng nghìn ô. */
export interface DaySummary {
  readonly jd: JulianDay;
  readonly solar: SolarDate;
  readonly lunar: LunarDate;
  readonly weekday: Weekday;
  readonly holidays: readonly Holiday[];
}

/** Thông tin đầy đủ cho màn hình chi tiết ngày. */
export interface DayDetail extends DaySummary {
  readonly canChi: {
    readonly day: CanChi;
    readonly month: CanChi;
    readonly year: CanChi;
  };
  readonly solarTerm: SolarTermInfo;
  readonly quality: DayQuality;
  readonly auspiciousHours: readonly AuspiciousHour[];
}

export function getDaySummary(jd: JulianDay): DaySummary {
  const solar = fromJulianDay(jd);
  const lunar = jdToLunar(jd);
  return {
    jd,
    solar,
    lunar,
    weekday: weekdayOf(jd),
    holidays: holidaysOf({
      solar,
      lunar,
      nextLunar: jdToLunar(addDays(jd, 1)),
    }),
  };
}

export function getDayDetail(date: SolarDate): DayDetail {
  const summary = getDaySummary(toJulianDay(date));
  const { jd, lunar } = summary;
  return {
    ...summary,
    canChi: {
      day: dayCanChi(jd),
      month: monthCanChi(lunar.year, lunar.month),
      year: yearCanChi(lunar.year),
    },
    solarTerm: solarTermOf(jd),
    quality: dayQualityOf(jd, lunar.month),
    auspiciousHours: auspiciousHoursOf(jd),
  };
}
