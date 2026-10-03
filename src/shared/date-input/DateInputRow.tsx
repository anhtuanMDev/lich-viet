import { View } from 'react-native';
import { createThemedStyles } from '@shared/theme';
import { NumberField } from '@shared/ui';
import type { InvalidField } from './dateInput';

export interface DateInputRowProps {
  readonly day: string;
  readonly month: string;
  readonly year: string;
  readonly invalidField: InvalidField | null;
  readonly onChangeDay: (value: string) => void;
  readonly onChangeMonth: (value: string) => void;
  readonly onChangeYear: (value: string) => void;
}

export function DateInputRow({
  day,
  month,
  year,
  invalidField,
  onChangeDay,
  onChangeMonth,
  onChangeYear,
}: DateInputRowProps) {
  const styles = useStyles();
  return (
    <View style={styles.row}>
      <NumberField
        label="Ngày"
        value={day}
        onChangeValue={onChangeDay}
        maxLength={2}
        invalid={invalidField === 'day'}
      />
      <NumberField
        label="Tháng"
        value={month}
        onChangeValue={onChangeMonth}
        maxLength={2}
        invalid={invalidField === 'month'}
      />
      <View style={styles.year}>
        <NumberField
          label="Năm"
          value={year}
          onChangeValue={onChangeYear}
          maxLength={4}
          invalid={invalidField === 'year'}
        />
      </View>
    </View>
  );
}

const useStyles = createThemedStyles(t => ({
  row: {
    flexDirection: 'row',
    gap: t.spacing.md,
  },
  year: {
    flex: 1.6,
    flexDirection: 'row',
  },
}));
