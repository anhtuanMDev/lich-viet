import { Switch, View } from 'react-native';
import { createThemedStyles } from '@shared/theme';
import { AppText } from './AppText';
import { useSwitchColors } from './useSwitchColors';

export interface SwitchRowProps {
  readonly label: string;
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
}

export function SwitchRow({ label, value, onChange }: SwitchRowProps) {
  const styles = useStyles();
  const switchColors = useSwitchColors(value);
  return (
    <View style={styles.row}>
      <AppText style={styles.label}>{label}</AppText>
      <Switch
        value={value}
        onValueChange={onChange}
        {...switchColors}
        accessibilityLabel={label}
      />
    </View>
  );
}

const useStyles = createThemedStyles(t => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: t.spacing.md,
  },
  label: {
    flex: 1,
  },
}));
