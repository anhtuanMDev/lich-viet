import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { SPOKEN, spokenLunarDate, spokenSolarDate } from '@core/a11y';
import { formatSolar, lunarMonthName, weekdayName } from '@core/date/format';
import { formatCanChi, toJulianDay, weekdayOf, yearCanChi } from '@core/lunar';
import type { LunarDate, SolarDate } from '@core/lunar';
import { useAnnounce } from '@shared/a11y';
import { createThemedStyles } from '@shared/theme';
import { AppText, Card } from '@shared/ui';
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
    return (
      <Card>
        <AppText color="textMuted" align="center">
          Nhập đủ ngày, tháng, năm để xem kết quả
        </AppText>
      </Card>
    );
  }
  if (result.status === 'invalid') {
    return (
      <Card>
        <AppText
          color="holiday"
          align="center"
          accessibilityLiveRegion="polite"
        >
          {result.message}
        </AppText>
      </Card>
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
      primary={`${lunar.day} ${lunarMonthName(lunar.month, lunar.isLeapMonth)}`}
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
      primary={formatSolar(solar)}
      secondary={weekdayName(weekday)}
    />
  );
}

function ResultCard({
  solar,
  onOpenDay,
  spoken,
  label,
  primary,
  secondary,
}: ResultProps & {
  readonly label: string;
  readonly primary: string;
  readonly secondary: string;
}) {
  const styles = useStyles();
  return (
    <Card title={label}>
      {/* Đọc gộp một câu đầy đủ thay vì "9 tháng Chín" rồi "Năm Bính Ngọ (2026)". */}
      <View
        style={styles.result}
        accessible
        accessibilityLabel={spoken}
        accessibilityLiveRegion="polite"
      >
        <AppText variant="title" color="lunarAccent">
          {primary}
        </AppText>
        <AppText color="textMuted">{secondary}</AppText>
      </View>
      <Pressable
        onPress={() => onOpenDay(solar)}
        accessibilityRole="button"
        accessibilityHint={SPOKEN.hint.openDay}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <AppText variant="label" color="primary">
          Xem chi tiết ngày →
        </AppText>
      </Pressable>
    </Card>
  );
}

const useStyles = createThemedStyles(t => ({
  // Giữ khoảng cách cũ giữa hai dòng (bằng gap của Card).
  result: {
    gap: t.spacing.sm,
  },
  button: {
    alignSelf: 'flex-start',
    marginTop: t.spacing.xs,
    paddingVertical: t.spacing.xs,
  },
  pressed: {
    opacity: 0.6,
  },
}));
