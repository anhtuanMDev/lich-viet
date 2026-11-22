import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SPOKEN } from '@core/a11y';
import type { SolarDate } from '@core/lunar';
import { DateInputRow, LeapMonthSwitch } from '@shared/date-input';
import type { ConversionDirection } from '@shared/date-input';
import { useToday } from '@shared/hooks/useToday';
import { FieldGroup, Screen, Section, SegmentedControl } from '@shared/ui';
import type { SegmentOption } from '@shared/ui';
import { ConversionResultCard } from './components/ConversionResultCard';
import { useConverter } from './hooks/useConverter';

const DIRECTIONS: readonly SegmentOption<ConversionDirection>[] = [
  {
    value: 'solarToLunar',
    label: 'Dương → Âm',
    spokenLabel: SPOKEN.solarToLunar,
  },
  {
    value: 'lunarToSolar',
    label: 'Âm → Dương',
    spokenLabel: SPOKEN.lunarToSolar,
  },
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
    <Screen inTabs>
      <FieldGroup>
        <SegmentedControl
          options={DIRECTIONS}
          value={input.direction}
          onChange={converter.setDirection}
        />
      </FieldGroup>
      <Section
        title={
          input.direction === 'solarToLunar'
            ? 'Ngày dương lịch'
            : 'Ngày âm lịch'
        }
        separators={false}
      >
        <FieldGroup>
          <DateInputRow
            day={input.day}
            month={input.month}
            year={input.year}
            invalidField={result.status === 'invalid' ? result.field : null}
            onChangeDay={converter.setDay}
            onChangeMonth={converter.setMonth}
            onChangeYear={converter.setYear}
          />
        </FieldGroup>
        {converter.canChooseLeap ? (
          <LeapMonthSwitch
            month={input.month}
            value={input.isLeapMonth}
            onChange={converter.setLeap}
          />
        ) : null}
      </Section>
      <ConversionResultCard
        direction={input.direction}
        result={result}
        onOpenDay={openDay}
      />
    </Screen>
  );
}
