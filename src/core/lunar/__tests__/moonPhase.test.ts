import { jdToLunar } from '../converter';
import { asJulianDay, toJulianDay } from '../julian';
import { moonPhaseOf } from '../moonPhase';

describe('pha trăng', () => {
  it('14 tháng Mười Bính Ngọ (22/11/2026): gần tròn, đang tròn dần', () => {
    const phase = moonPhaseOf(toJulianDay({ year: 2026, month: 11, day: 22 }));
    expect(phase.waxing).toBe(true);
    expect(phase.illumination).toBeGreaterThan(0.9);
    expect(phase.illumination).toBeLessThan(1);
  });

  it('khớp âm lịch 2000-2030: mùng 1 gần như tối, rằm gần như tròn', () => {
    const start = toJulianDay({ year: 2000, month: 1, day: 1 });
    const end = toJulianDay({ year: 2030, month: 12, day: 31 });
    for (let jd = start; jd <= end; jd++) {
      const day = asJulianDay(jd);
      const { day: lunarDay } = jdToLunar(day);
      const { illumination, cycle } = moonPhaseOf(day);
      expect(cycle).toBeGreaterThanOrEqual(0);
      expect(cycle).toBeLessThan(1);
      if (lunarDay === 1) {
        expect(illumination).toBeLessThan(0.12);
      }
      if (lunarDay === 15) {
        expect(illumination).toBeGreaterThan(0.88);
      }
    }
  });

  it('nửa sau tháng âm là trăng khuyết dần', () => {
    const phase = moonPhaseOf(toJulianDay({ year: 2026, month: 12, day: 2 }));
    expect(jdToLunar(toJulianDay({ year: 2026, month: 12, day: 2 })).day).toBe(
      24,
    );
    expect(phase.waxing).toBe(false);
  });
});
