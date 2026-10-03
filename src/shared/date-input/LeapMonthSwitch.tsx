import { Switch, View } from 'react-native';
import { createThemedStyles, useTheme } from '@shared/theme';
import { AppText } from '@shared/ui';

export interface LeapMonthSwitchProps {
  readonly month: string;
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
}

export function LeapMonthSwitch({
  month,
  value,
  onChange,
}: LeapMonthSwitchProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <AppText style={styles.label}>Tháng {month} nhuận</AppText>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: colors.primary, false: colors.border }}
        accessibilityLabel={`Chọn tháng ${month} nhuận`}
      />
    </View>
  );
}

const useStyles = createThemedStyles(() => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
  },
}));
