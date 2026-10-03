import type {
  CanChi,
  EarthlyBranch,
  HeavenlyStem,
  JulianDay,
  MonthNumber,
} from './types';

export const STEMS: readonly HeavenlyStem[] = [
  'Giáp',
  'Ất',
  'Bính',
  'Đinh',
  'Mậu',
  'Kỷ',
  'Canh',
  'Tân',
  'Nhâm',
  'Quý',
];

export const BRANCHES: readonly EarthlyBranch[] = [
  'Tý',
  'Sửu',
  'Dần',
  'Mão',
  'Thìn',
  'Tỵ',
  'Ngọ',
  'Mùi',
  'Thân',
  'Dậu',
  'Tuất',
  'Hợi',
];

const mod = (n: number, m: number): number => ((n % m) + m) % m;

// Hai mảng có độ dài cố định nên chỉ số luôn hợp lệ sau mod.
const stemAt = (i: number): HeavenlyStem => STEMS[mod(i, 10)] as HeavenlyStem;
export const branchAt = (i: number): EarthlyBranch =>
  BRANCHES[mod(i, 12)] as EarthlyBranch;

/** Chỉ số địa chi (0 = Tý) của một ngày. */
export const dayBranchIndex = (jd: JulianDay): number => mod(jd + 1, 12);

export const yearCanChi = (lunarYear: number): CanChi => ({
  stem: stemAt(lunarYear + 6),
  branch: branchAt(lunarYear + 8),
});

/** Tháng nhuận dùng chung can chi với tháng chính. Tháng Giêng luôn là tháng Dần. */
export const monthCanChi = (lunarYear: number, month: MonthNumber): CanChi => ({
  stem: stemAt(lunarYear * 12 + month + 3),
  branch: branchAt(month + 1),
});

export const dayCanChi = (jd: JulianDay): CanChi => ({
  stem: stemAt(jd + 9),
  branch: branchAt(jd + 1),
});

/** Can chi của giờ Tý (giờ đầu tiên) trong ngày. */
export const firstHourCanChi = (jd: JulianDay): CanChi => ({
  stem: stemAt((jd - 1) * 2),
  branch: 'Tý',
});

export const formatCanChi = ({ stem, branch }: CanChi): string =>
  `${stem} ${branch}`;
