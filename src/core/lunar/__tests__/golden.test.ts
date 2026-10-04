/**
 * Golden tests: so khớp TỪNG NGÀY 1900-2100 với một bản cài đặt độc lập
 * (@tuquet/lunar, thuật toán Hồ Ngọc Đức, UTC+7). Nếu test này đỏ, KHÔNG sửa
 * kỳ vọng - hãy tìm hiểu vì sao kết quả lệch so với lịch chuẩn.
 */
import * as reference from '@tuquet/lunar';
import {
  SUPPORTED_YEAR_RANGE,
  addDays,
  dayCanChi,
  formatCanChi,
  fromJulianDay,
  jdToLunar,
  leapMonthOf,
  lunarToJd,
  monthCanChi,
  solarTermOf,
  toJulianDay,
  yearCanChi,
} from '../index';
import type { JulianDay } from '../types';

const first = toJulianDay({ year: SUPPORTED_YEAR_RANGE.min, month: 1, day: 1 });
const last = toJulianDay({
  year: SUPPORTED_YEAR_RANGE.max,
  month: 12,
  day: 31,
});

function* everyDay(): Generator<JulianDay> {
  for (let jd = first; jd <= last; jd = addDays(jd, 1)) {
    yield jd;
  }
}

/** Gom các ngày lệch để thông báo lỗi dễ đọc thay vì 73.000 assertion. */
function collectMismatches(check: (jd: JulianDay) => string | null): string[] {
  const mismatches: string[] = [];
  for (const jd of everyDay()) {
    const problem = check(jd);
    if (problem !== null && mismatches.length < 20) {
      mismatches.push(problem);
    }
  }
  return mismatches;
}

const fmt = (jd: JulianDay): string => {
  const { year, month, day } = fromJulianDay(jd);
  return `${day}/${month}/${year}`;
};

describe('đối chiếu với @tuquet/lunar cho mọi ngày 1900-2100', () => {
  it('đổi dương → âm khớp hoàn toàn', () => {
    const mismatches = collectMismatches(jd => {
      const ours = jdToLunar(jd);
      const ref = reference.solarToLunar(fromJulianDay(jd));
      if (ref.day === 0) {
        // Lỗi "mùng 0" của thuật toán gốc (đã sửa ở converter.ts): ngày này phải là
        // ngày nối tiếp của hôm trước.
        const prev = jdToLunar(addDays(jd, -1));
        const continues =
          ours.day === prev.day + 1 && ours.month === prev.month;
        return continues ? null : `${fmt(jd)}: không nối tiếp ngày trước`;
      }
      const same =
        ours.day === ref.day &&
        ours.month === ref.month &&
        ours.year === ref.year &&
        ours.isLeapMonth === ref.isLeap;
      return same
        ? null
        : `${fmt(jd)}: ours=${JSON.stringify(ours)} ref=${JSON.stringify(ref)}`;
    });
    expect(mismatches).toEqual([]);
  });

  it('đổi âm → dương trả lại đúng ngày ban đầu (round-trip)', () => {
    const mismatches = collectMismatches(jd => {
      const back = lunarToJd(jdToLunar(jd));
      return back === jd
        ? null
        : `${fmt(jd)} → ${back === null ? 'null' : fmt(back)}`;
    });
    expect(mismatches).toEqual([]);
  });

  // Quy ước Hồ Ngọc Đức: tiết khí của một ngày là tiết khí tại cuối ngày đó,
  // còn @tuquet/lunar lấy tại 0h đầu ngày → so với giá trị của ngày hôm sau.
  it('tiết khí và can chi ngày khớp', () => {
    const mismatches = collectMismatches(jd => {
      const solar = fromJulianDay(jd);
      const term = solarTermOf(jd).name;
      const refTerm = reference.getSolarTerm(fromJulianDay(addDays(jd, 1)));
      const canChi = formatCanChi(dayCanChi(jd));
      const refCanChi = reference.getCanChiDay(solar).full;
      return term === refTerm && canChi === refCanChi
        ? null
        : `${fmt(jd)}: ${term}/${canChi} vs ${refTerm}/${refCanChi}`;
    });
    expect(mismatches).toEqual([]);
  });

  // Không dùng reference.getLeapLunarMonth: hàm này gán nhuận tháng 11/2033 cho năm 2034,
  // mâu thuẫn với chính solarToLunar của thư viện. Suy ra tháng nhuận từ dữ liệu từng ngày.
  it('tháng nhuận, can chi tháng và năm khớp', () => {
    const refLeapMonths = new Map<number, number>();
    for (const jd of everyDay()) {
      const ref = reference.solarToLunar(fromJulianDay(jd));
      if (ref.isLeap) {
        refLeapMonths.set(ref.year, ref.month);
      }
    }
    // Năm âm 1899 chỉ lọt một phần vào khoảng kiểm tra.
    for (
      let year = SUPPORTED_YEAR_RANGE.min;
      year < SUPPORTED_YEAR_RANGE.max;
      year++
    ) {
      expect([year, leapMonthOf(year)]).toEqual([
        year,
        refLeapMonths.get(year) ?? null,
      ]);
      expect(formatCanChi(yearCanChi(year))).toBe(
        reference.getCanChiYear(year).full,
      );
      for (const month of [1, 6, 12] as const) {
        expect(formatCanChi(monthCanChi(year, month))).toBe(
          reference.getCanChiMonth(month, year).full,
        );
      }
    }
  });
});
