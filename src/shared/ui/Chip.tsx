import { View } from 'react-native';
import { createThemedStyles } from '@shared/theme';
import type { ColorTokens } from '@shared/theme';
import { AppText } from './AppText';

export interface ChipProps {
  readonly label: string;
  readonly tone?: 'primary' | 'neutral';
}

const TEXT_COLOR: Readonly<
  Record<NonNullable<ChipProps['tone']>, keyof ColorTokens>
> = {
  primary: 'primary',
  neutral: 'textMuted',
};

export function Chip({ label, tone = 'neutral' }: ChipProps) {
  const styles = useStyles();
  return (
    <View style={[styles.chip, tone === 'primary' && styles.primary]}>
      <AppText variant="label" color={TEXT_COLOR[tone]}>
        {label}
      </AppText>
    </View>
  );
}

const useStyles = createThemedStyles(t => ({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: t.spacing.md,
    paddingVertical: t.spacing.xs,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.surfaceMuted,
  },
  primary: {
    backgroundColor: t.colors.primarySoft,
  },
}));
