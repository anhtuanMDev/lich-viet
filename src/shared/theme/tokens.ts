export interface ColorTokens {
  readonly background: string;
  readonly surface: string;
  readonly surfaceMuted: string;
  readonly border: string;
  readonly text: string;
  readonly textMuted: string;
  readonly textFaint: string;
  /** Màu nhấn chính – đỏ son quen thuộc của lịch Việt. */
  readonly primary: string;
  readonly onPrimary: string;
  readonly primarySoft: string;
  /** Chủ nhật, ngày lễ nghỉ. */
  readonly holiday: string;
  /** Ngày âm: mùng 1, rằm. */
  readonly lunarAccent: string;
  /** Sự kiện cá nhân (giỗ, sinh nhật…) – tách màu với ngày lễ. */
  readonly event: string;
  readonly auspicious: string;
  readonly inauspicious: string;
}

export const lightColors: ColorTokens = {
  background: '#FAF7F2',
  surface: '#FFFFFF',
  surfaceMuted: '#F2EDE4',
  border: '#E6DFD3',
  text: '#1F1B16',
  textMuted: '#5E564B',
  textFaint: '#A39A8C',
  primary: '#B3261E',
  onPrimary: '#FFFFFF',
  primarySoft: '#FBE4E1',
  holiday: '#C62828',
  lunarAccent: '#B26A00',
  event: '#1F6FB2',
  auspicious: '#2E7D32',
  inauspicious: '#6D4C41',
};

export const darkColors: ColorTokens = {
  background: '#14110E',
  surface: '#1F1B17',
  surfaceMuted: '#2A2520',
  border: '#3A332C',
  text: '#F3EDE4',
  textMuted: '#C7BDAF',
  textFaint: '#7D7468',
  primary: '#FF8A80',
  onPrimary: '#3B0906',
  primarySoft: '#4A1C18',
  holiday: '#FF8A80',
  lunarAccent: '#FFB74D',
  event: '#7FB8E6',
  auspicious: '#81C784',
  inauspicious: '#BCAAA4',
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 72, lineHeight: 80, fontWeight: '700' },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  heading: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 21, fontWeight: '400' },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
  caption: { fontSize: 11, lineHeight: 14, fontWeight: '400' },
} as const;

export type TypographyVariant = keyof typeof typography;

export interface Theme {
  readonly dark: boolean;
  readonly colors: ColorTokens;
  readonly spacing: typeof spacing;
  readonly radius: typeof radius;
  readonly typography: typeof typography;
}

export const lightTheme: Theme = {
  dark: false,
  colors: lightColors,
  spacing,
  radius,
  typography,
};

export const darkTheme: Theme = {
  dark: true,
  colors: darkColors,
  spacing,
  radius,
  typography,
};
