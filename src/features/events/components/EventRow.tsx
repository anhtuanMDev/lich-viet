import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { anniversaryAt } from '@core/events';
import type { CalendarEvent } from '@core/events';
import type { JulianDay } from '@core/lunar';
import { createThemedStyles } from '@shared/theme';
import { AppText } from '@shared/ui';
import {
  describeDaysAway,
  describeOrigin,
  describeSolarDay,
} from '../formatEvent';

export interface EventRowProps {
  readonly event: CalendarEvent;
  /** Lần diễn ra kế tiếp; null với sự kiện một lần đã qua. */
  readonly next: { readonly date: JulianDay; readonly daysAway: number } | null;
  readonly onPress: (id: string) => void;
}

export const EventRow = memo(function EventRowView({
  event,
  next,
  onPress,
}: EventRowProps) {
  const styles = useStyles();
  const anniversary =
    next && event.repeat === 'yearly' ? anniversaryAt(event, next.date) : 0;

  return (
    <Pressable
      onPress={() => onPress(event.id)}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.marker} />
      <View style={styles.body}>
        <AppText variant="heading" numberOfLines={1}>
          {event.title}
        </AppText>
        <AppText variant="label" color="textMuted">
          {describeOrigin(event)}
          {anniversary > 0 ? ` · lần thứ ${anniversary}` : ''}
        </AppText>
        {next ? (
          <AppText variant="label" color="event">
            {describeSolarDay(next.date)}
          </AppText>
        ) : null}
      </View>
      {next ? (
        <AppText
          variant="label"
          color={next.daysAway <= 1 ? 'primary' : 'textMuted'}
          style={styles.badge}
        >
          {describeDaysAway(next.daysAway)}
        </AppText>
      ) : null}
    </Pressable>
  );
});

const useStyles = createThemedStyles(t => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.md,
    paddingVertical: t.spacing.md,
    paddingHorizontal: t.spacing.lg,
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  pressed: {
    backgroundColor: t.colors.surfaceMuted,
  },
  marker: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
    backgroundColor: t.colors.event,
  },
  body: {
    flex: 1,
    gap: t.spacing.xxs,
  },
  badge: {
    flexShrink: 0,
  },
}));
