import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { SolarDate } from '@core/lunar';
import { DateInputRow, LeapMonthSwitch } from '@shared/date-input';
import type { ConversionDirection } from '@shared/date-input';
import { useToday } from '@shared/hooks/useToday';
import { AppText, Card, Screen, SegmentedControl } from '@shared/ui';
import type { SegmentOption } from '@shared/ui';
import { ConversionResultCard } from './components/ConversionResultCard';
import { useConverter } from './hooks/useConverter';

const DIRECTIONS: readonly SegmentOption<ConversionDirection>[] = [
  { value: 'solarToLunar', label: 'Dương → Âm' },
  { value: 'lunarToSolar', label: 'Âm → Dương' },
];

export function ConverterScreen() {
  const navigation = useNavigation();
  const today = useToday();
  const converter = useConverter(today);
  const { input, result } = converter;

  const openDay = useCallback(
    (date: SolarDate) => navigation.navigate('DayDetail', { date }),
    [navigation],
  );

  return (
    <Screen>
      <AppText variant="title">Đổi ngày</AppText>
      <SegmentedControl
        options={DIRECTIONS}
        value={input.direction}
        onChange={converter.setDirection}
      />
      <Card
        title={
          input.direction === 'solarToLunar'
            ? 'Ngày dương lịch'
            : 'Ngày âm lịch'
        }
      >
        <DateInputRow
          day={input.day}
          month={input.month}
          year={input.year}
          invalidField={result.status === 'invalid' ? result.field : null}
          onChangeDay={converter.setDay}
          onChangeMonth={converter.setMonth}
          onChangeYear={converter.setYear}
        />
        {converter.canChooseLeap ? (
          <LeapMonthSwitch
            month={input.month}
            value={input.isLeapMonth}
            onChange={converter.setLeap}
          />
        ) : null}
      </Card>
      <ConversionResultCard
        direction={input.direction}
        result={result}
        onOpenDay={openDay}
      />
    </Screen>
  );
}
