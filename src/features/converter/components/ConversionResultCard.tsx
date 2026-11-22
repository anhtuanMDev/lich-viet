import { useMemo } from 'react';
import { View } from 'react-native';
import { SPOKEN, spokenLunarDate, spokenSolarDate } from '@core/a11y';
import { lunarDayTitle, solarDayTitle } from '@core/date/format';
import { formatCanChi, toJulianDay, weekdayOf, yearCanChi } from '@core/lunar';
import type { LunarDate, SolarDate } from '@core/lunar';
import { useAnnounce } from '@shared/a11y';
import { createThemedStyles } from '@shared/theme';
import { ActionRow, AppText, Section } from '@shared/ui';
import type { ConversionDirection, ConversionResult } from '@shared/date-input';

export interface ConversionResultCardProps {
  readonly direction: ConversionDirection;
  readonly result: ConversionResult;
  readonly onOpenDay: (date: SolarDate) => void;
}

export function ConversionResultCard({
  direction,
  result,
  onOpenDay,
}: ConversionResultCardProps) {
  // iOS không có live region: tự đọc kết quả / lỗi mỗi khi đổi.
  useAnnounce(spokenResult(direction, result));
  if (result.status === 'incomplete') {
    return <Section footer="Nhập đủ ngày, tháng, năm để xem kết quả." />;
  }
  if (result.status === 'invalid') {
    return (
      <Section>
        <ResultMessage text={result.message} />
      </Section>
    );
  }
  return direction === 'solarToLunar' ? (
    <LunarResult
      lunar={result.lunar}
      solar={result.solar}
      onOpenDay={onOpenDay}
      spoken={spokenResult(direction, result) ?? ''}
    />
  ) : (
    <SolarResult
      solar={result.solar}
      onOpenDay={onOpenDay}
      spoken={spokenResult(direction, result) ?? ''}
    />
  );
}

/** Câu đọc cho kết quả - cùng nội dung với thẻ kết quả bên dưới. */
function spokenResult(
  direction: ConversionDirection,
  result: ConversionResult,
): string | null {
  switch (result.status) {
    case 'incomplete':
      return null;
    case 'invalid':
      return result.message;
    case 'ok':
      return direction === 'solarToLunar'
        ? `Âm lịch: ${spokenLunarDate(result.lunar)}, năm ${formatCanChi(
            yearCanChi(result.lunar.year),
          )} ${result.lunar.year}`
        : `Dương lịch: ${spokenSolarDate(
            result.solar,
            weekdayOf(toJulianDay(result.solar)),
          )}`;
  }
}

interface ResultProps {
  readonly solar: SolarDate;
  readonly onOpenDay: (date: SolarDate) => void;
  readonly spoken: string;
}

function LunarResult({
  lunar,
  solar,
  onOpenDay,
  spoken,
}: ResultProps & { readonly lunar: LunarDate }) {
  return (
    <ResultCard
      solar={solar}
      onOpenDay={onOpenDay}
      spoken={spoken}
      label="Âm lịch"
      isLunar
      primary={lunarDayTitle(lunar)}
      secondary={`Năm ${formatCanChi(yearCanChi(lunar.year))} (${lunar.year})`}
    />
  );
}

function SolarResult({ solar, onOpenDay, spoken }: ResultProps) {
  const weekday = useMemo(() => weekdayOf(toJulianDay(solar)), [solar]);
  return (
    <ResultCard
      solar={solar}
      onOpenDay={onOpenDay}
      spoken={spoken}
      label="Dương lịch"
      primary={solarDayTitle(solar, weekday)}
      secondary=""
    />
  );
}

function ResultCard({
  solar,
  onOpenDay,
  spoken,
  label,
  isLunar = false,
  primary,
  secondary,
}: ResultProps & {
  readonly label: string;
  /** Kết quả là ngày âm: tô màu trăng. Ngày dương dùng màu chữ thường - màu trăng chỉ cho âm lịch. */
  readonly isLunar?: boolean;
  readonly primary: string;
  readonly secondary: string;
}) {
  const styles = useStyles();
  return (
    <Section title={label}>
      {/* Đọc gộp một câu đầy đủ thay vì "9 tháng Chín" rồi "Năm Bính Ngọ (2026)". */}
      <View
        style={styles.result}
        accessible
        accessibilityLabel={spoken}
        accessibilityLiveRegion="polite"
      >
        <AppText variant="title" color={isLunar ? 'lunarAccent' : 'text'}>
          {primary}
        </AppText>
        {secondary ? <AppText color="textMuted">{secondary}</AppText> : null}
      </View>
      <ActionRow
        label="Xem chi tiết ngày"
        materialIcon="calendar_month"
        opensScreen
        onPress={() => onOpenDay(solar)}
        hint={SPOKEN.hint.openDay}
      />
    </Section>
  );
}

function ResultMessage({ text }: { readonly text: string }) {
  const styles = useStyles();
  return (
    <View style={styles.result}>
      <AppText color="danger" accessibilityLiveRegion="polite">
        {text}
      </AppText>
    </View>
  );
}

const useStyles = createThemedStyles(t => ({
  result: {
    gap: t.spacing.xxs,
    paddingHorizontal: t.gutter,
    paddingVertical: t.spacing.sm,
  },
}));
