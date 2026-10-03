import { useMemo } from 'react';
import { Pressable } from 'react-native';
import { formatSolar, lunarMonthName, weekdayName } from '@core/date/format';
import { formatCanChi, toJulianDay, weekdayOf, yearCanChi } from '@core/lunar';
import type { LunarDate, SolarDate } from '@core/lunar';
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
    />
  ) : (
    <SolarResult solar={result.solar} onOpenDay={onOpenDay} />
  );
}

interface ResultProps {
  readonly solar: SolarDate;
  readonly onOpenDay: (date: SolarDate) => void;
}

function LunarResult({
  lunar,
  solar,
  onOpenDay,
}: ResultProps & { readonly lunar: LunarDate }) {
  return (
    <ResultCard
      solar={solar}
      onOpenDay={onOpenDay}
      label="Âm lịch"
      primary={`${lunar.day} ${lunarMonthName(lunar.month, lunar.isLeapMonth)}`}
      secondary={`Năm ${formatCanChi(yearCanChi(lunar.year))} (${lunar.year})`}
    />
  );
}

function SolarResult({ solar, onOpenDay }: ResultProps) {
  const weekday = useMemo(() => weekdayOf(toJulianDay(solar)), [solar]);
  return (
    <ResultCard
      solar={solar}
      onOpenDay={onOpenDay}
      label="Dương lịch"
      primary={formatSolar(solar)}
      secondary={weekdayName(weekday)}
    />
  );
}

function ResultCard({
  solar,
  onOpenDay,
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
      <AppText
        variant="title"
        color="lunarAccent"
        accessibilityLiveRegion="polite"
      >
        {primary}
      </AppText>
      <AppText color="textMuted">{secondary}</AppText>
      <Pressable
        onPress={() => onOpenDay(solar)}
        accessibilityRole="button"
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
  button: {
    alignSelf: 'flex-start',
    marginTop: t.spacing.xs,
    paddingVertical: t.spacing.xs,
  },
  pressed: {
    opacity: 0.6,
  },
}));
