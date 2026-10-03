import { sunSector } from './astronomy';
import { VIETNAM_TIMEZONE } from './converter';
import { addDays } from './julian';
import type { JulianDay, SolarTermInfo, SolarTermName } from './types';

/** Bắt đầu từ Xuân phân (kinh độ mặt trời 0°), mỗi tiết khí cách nhau 15°. */
export const SOLAR_TERMS: readonly SolarTermName[] = [
  'Xuân phân',
  'Thanh minh',
  'Cốc vũ',
  'Lập hạ',
  'Tiểu mãn',
  'Mang chủng',
  'Hạ chí',
  'Tiểu thử',
  'Đại thử',
  'Lập thu',
  'Xử thử',
  'Bạch lộ',
  'Thu phân',
  'Hàn lộ',
  'Sương giáng',
  'Lập đông',
  'Tiểu tuyết',
  'Đại tuyết',
  'Đông chí',
  'Tiểu hàn',
  'Đại hàn',
  'Lập xuân',
  'Vũ thủy',
  'Kinh trập',
];

/** Tiết khí tính theo vị trí mặt trời lúc cuối ngày (0h ngày hôm sau). */
const termIndexAt = (jd: JulianDay): number =>
  sunSector(addDays(jd, 1), VIETNAM_TIMEZONE, 24);

export function solarTermOf(jd: JulianDay): SolarTermInfo {
  const index = termIndexAt(jd);
  return {
    name: SOLAR_TERMS[index] as SolarTermName,
    startsToday: index !== termIndexAt(addDays(jd, -1)),
  };
}
