/**
 * Các công thức thiên văn rút gọn (Jean Meeus, "Astronomical Algorithms") theo cách
 * TS. Hồ Ngọc Đức áp dụng cho âm lịch Việt Nam. Không chỉnh sửa hệ số: mọi thay đổi
 * sẽ làm lệch kết quả so với lịch chuẩn đang được dùng rộng rãi (xem golden tests).
 */
import { asJulianDay } from './julian';
import type { JulianDay } from './types';

const DEG = Math.PI / 180;
const TWO_PI = Math.PI * 2;

/** Độ dài trung bình một tháng giao hội (ngày). */
export const SYNODIC_MONTH = 29.530588853;

/** Số ngày Julius của sóc (trăng mới) gốc dùng để đánh số k: 1900-01-01 13:51 UTC. */
export const NEW_MOON_EPOCH = 2415021.076998695;

/** Thời điểm (Julian Day, có phần thập phân, giờ UT) của lần sóc thứ k tính từ NEW_MOON_EPOCH. */
export function newMoonMoment(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  let jd = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  jd += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * DEG);

  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;

  let c1 =
    (0.1734 - 0.000393 * T) * Math.sin(M * DEG) +
    0.0021 * Math.sin(2 * DEG * M);
  c1 = c1 - 0.4068 * Math.sin(Mpr * DEG) + 0.0161 * Math.sin(DEG * 2 * Mpr);
  c1 = c1 - 0.0004 * Math.sin(DEG * 3 * Mpr);
  c1 = c1 + 0.0104 * Math.sin(DEG * 2 * F) - 0.0051 * Math.sin(DEG * (M + Mpr));
  c1 =
    c1 -
    0.0074 * Math.sin(DEG * (M - Mpr)) +
    0.0004 * Math.sin(DEG * (2 * F + M));
  c1 =
    c1 -
    0.0004 * Math.sin(DEG * (2 * F - M)) -
    0.0006 * Math.sin(DEG * (2 * F + Mpr));
  c1 =
    c1 +
    0.001 * Math.sin(DEG * (2 * F - Mpr)) +
    0.0005 * Math.sin(DEG * (2 * Mpr + M));

  const deltaT =
    T < -11
      ? 0.001 +
        0.000839 * T +
        0.0002261 * T2 -
        0.00000845 * T3 -
        0.000000081 * T * T3
      : -0.000278 + 0.000265 * T + 0.000262 * T2;

  return jd + c1 - deltaT;
}

/** Kinh độ mặt trời (radian, 0..2π) tại thời điểm Julian Day `jd` (giờ UT). */
export function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const T2 = T * T;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(DEG * M);
  DL +=
    (0.019993 - 0.000101 * T) * Math.sin(DEG * 2 * M) +
    0.00029 * Math.sin(DEG * 3 * M);
  const L = (L0 + DL) * DEG;
  return L - TWO_PI * Math.floor(L / TWO_PI);
}

/** Ngày (theo múi giờ `tz`) chứa lần sóc thứ k. */
export const newMoonDay = (k: number, tz: number): JulianDay =>
  asJulianDay(Math.floor(newMoonMoment(k) + 0.5 + tz / 24));

/**
 * Vị trí mặt trời lúc 0h ngày `jd` (múi giờ `tz`), chia thành `sectors` cung đều nhau.
 * sectors = 12 → trung khí (dùng để xác định tháng nhuận); 24 → tiết khí.
 */
export const sunSector = (
  jd: JulianDay,
  tz: number,
  sectors: 12 | 24,
): number =>
  Math.floor((sunLongitude(jd - 0.5 - tz / 24) / Math.PI) * (sectors / 2));
