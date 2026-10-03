import { View } from 'react-native';
import { createThemedStyles } from '@shared/theme';
import type { ColorTokens } from '@shared/theme';
import { AppText } from './AppText';

export interface InfoRowProps {
  readonly label: string;
  readonly value: string;
  readonly valueColor?: keyof ColorTokens;
}

export function InfoRow({ label, value, valueColor = 'text' }: InfoRowProps) {
  const styles = useStyles();
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${label}: ${value}`}
    >
      <AppText color="textMuted" style={styles.label}>
        {label}
      </AppText>
      <AppText variant="heading" color={valueColor} style={styles.value}>
        {value}
      </AppText>
    </View>
  );
}

const useStyles = createThemedStyles(t => ({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: t.spacing.md,
  },
  label: {
    flexShrink: 0,
  },
  value: {
    flexShrink: 1,
    textAlign: 'right',
  },
}));
