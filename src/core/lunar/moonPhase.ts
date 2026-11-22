import { NEW_MOON_EPOCH, SYNODIC_MONTH, newMoonMoment } from './astronomy';

import type { JulianDay, LunarDate } from './types';

/** Ngày âm của sóc (mùng 1) và vọng (rằm) theo lịch. */
export const NEW_MOON_LUNAR_DAY = 1;
export const FULL_MOON_LUNAR_DAY = 15;

/** Nửa chu kỳ: trước đó trăng tròn dần, sau đó khuyết dần. */
const HALF_CYCLE = 0.5;

export type LunarMark = 'new' | 'full';

/** Mùng 1 → 'new', rằm → 'full', ngày khác → null. Dùng cho ký hiệu trăng trên lịch. */
export function lunarMarkOf({ day }: Pick<LunarDate, 'day'>): LunarMark | null {
  if (day === NEW_MOON_LUNAR_DAY) {
    return 'new';
  }
  return day === FULL_MOON_LUNAR_DAY ? 'full' : null;
}

export interface MoonPhase {
  /** Vị trí trong chu kỳ giao hội, 0 = sóc (trăng mới), 0.5 = vọng (trăng tròn), gần 1 = cuối tháng. */
  readonly cycle: number;
  /** Phần đĩa trăng được chiếu sáng, 0..1. */
  readonly illumination: number;
  /** Trăng đang tròn dần (nửa đầu tháng âm) - phần sáng ở bên phải khi nhìn từ Việt Nam. */
  readonly waxing: boolean;
}

/**
 * Pha trăng thật của một ngày, tính tại 19h giờ Việt Nam (12h UT) - lúc trăng thường
 * đã lên. Dùng cùng công thức sóc với phần đổi lịch, nên mùng 1 luôn gần sóc và rằm gần vọng.
 *
 * Số ngày Julius nguyên ứng với 12h UT của ngày đó, nên dùng thẳng làm thời điểm.
 */
export function moonPhaseOf(jd: JulianDay): MoonPhase {
  const moment: number = jd;
  let k = Math.floor((moment - NEW_MOON_EPOCH) / SYNODIC_MONTH);
  let start = newMoonMoment(k);
  // Công thức gần đúng của k có thể lệch một chu kỳ ở sát thời điểm sóc.
  while (start > moment) {
    k -= 1;
    start = newMoonMoment(k);
  }
  let end = newMoonMoment(k + 1);
  while (end <= moment) {
    k += 1;
    start = end;
    end = newMoonMoment(k + 1);
  }
  const cycle = (moment - start) / (end - start);
  return {
    cycle,
    illumination: (1 - Math.cos(2 * Math.PI * cycle)) / 2,
    waxing: cycle < HALF_CYCLE,
  };
}
