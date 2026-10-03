import { View } from 'react-native';
import type { ViewProps } from 'react-native';
import { createThemedStyles } from '@shared/theme';
import { AppText } from './AppText';

export interface CardProps extends ViewProps {
  readonly title?: string;
}

export function Card({ title, children, style, ...rest }: CardProps) {
  const styles = useStyles();
  return (
    <View style={[styles.card, style]} {...rest}>
      {title ? (
        <AppText variant="label" color="textMuted" style={styles.title}>
          {title.toUpperCase()}
        </AppText>
      ) : null}
      {children}
    </View>
  );
}

const useStyles = createThemedStyles(t => ({
  card: {
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.border,
    padding: t.spacing.lg,
    gap: t.spacing.sm,
  },
  title: {
    letterSpacing: 0.5,
  },
}));
