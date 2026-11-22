import type { MoonPhase } from '@core/lunar';

/** Dưới mức chiếu sáng này coi như trăng mới: không vẽ phần sáng. */
const NEW_MOON_ILLUMINATION = 0.02;
/** Trên mức này coi như trăng tròn: tô kín đĩa. */
const FULL_MOON_ILLUMINATION = 0.985;
/** Làm tròn toạ độ SVG tới 2 chữ số thập phân. */
const COORD_PRECISION = 100;

export type MoonFill = 'none' | 'full' | 'partial';

const fillOf = (illumination: number): MoonFill => {
  if (illumination < NEW_MOON_ILLUMINATION) {
    return 'none';
  }
  return illumination > FULL_MOON_ILLUMINATION ? 'full' : 'partial';
};

const roundCoord = (value: number): number =>
  Math.round(value * COORD_PRECISION) / COORD_PRECISION;

/** Kết quả vẽ phần sáng: không vẽ, cả đĩa, hoặc đường viền SVG của phần sáng. */
export type MoonLitPath =
  | { readonly fill: 'none' }
  | { readonly fill: 'full' }
  | { readonly fill: 'partial'; readonly path: string };

/**
 * Đường viền phần sáng của đĩa trăng bán kính `radius`, tâm ở gốc toạ độ (SVG, trục y
 * hướng xuống). Dùng cho widget Android (vẽ SVG).
 *
 * Phần sáng = nửa đĩa phía có mặt trời (bên phải khi trăng tròn dần) cộng/trừ nửa elip
 * của đường phân cách sáng tối, bán trục ngang radius·|cos φ| với φ = 2π·cycle.
 */
export function moonLitPath(phase: MoonPhase, radius: number): MoonLitPath {
  const fill = fillOf(phase.illumination);
  if (fill !== 'partial') {
    return { fill };
  }
  const cos = Math.cos(2 * Math.PI * phase.cycle);
  const isCrescent = cos > 0;
  const rx = String(roundCoord(Math.abs(cos) * radius));
  const ry = String(radius);
  // Cờ "sweep" của lệnh cung SVG: 1 = theo chiều kim đồng hồ.
  const edgeSweep = String(Number(phase.waxing));
  const terminatorSweep = String(Number(phase.waxing !== isCrescent));
  return {
    fill,
    path:
      `M0 -${ry}A${ry} ${ry} 0 0 ${edgeSweep} 0 ${ry}` +
      `A${rx} ${ry} 0 0 ${terminatorSweep} 0 -${ry}Z`,
  };
}

export interface MoonShape {
  readonly fill: MoonFill;
  /** Nửa đĩa luôn sáng: phải khi trăng tròn dần, trái khi khuyết dần. */
  readonly litSide: 'left' | 'right';
  /** Bề rộng elip đường phân cách so với đường kính (0..1). */
  readonly terminatorScale: number;
  /** true: elip tô màu sáng (trăng quá nửa); false: tô màu tối (lưỡi liềm). */
  readonly isTerminatorLit: boolean;
}

/**
 * Cùng hình học với moonLitPath nhưng ở dạng vẽ được bằng View: nửa đĩa sáng + một elip
 * (hình tròn co theo trục ngang) phủ lên giữa, tô sáng hoặc tối tuỳ trăng quá nửa hay chưa.
 */
export function moonShape({
  cycle,
  illumination,
  waxing,
}: MoonPhase): MoonShape {
  const cos = Math.cos(2 * Math.PI * cycle);
  return {
    fill: fillOf(illumination),
    litSide: waxing ? 'right' : 'left',
    terminatorScale: Math.abs(cos),
    isTerminatorLit: cos < 0,
  };
}
