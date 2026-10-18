import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { SPOKEN, spokenEvent } from '@core/a11y';
import { anniversaryAt } from '@core/events';
import type { CalendarEvent } from '@core/events';
import { fromJulianDay, weekdayOf } from '@core/lunar';
import type { JulianDay } from '@core/lunar';
import { createThemedStyles } from '@shared/theme';
import { AppText, Chip } from '@shared/ui';
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

/**
 * Tên chiếm trọn chiều ngang; ngày + "Còn N ngày" nằm ở hàng cuối và tự xuống dòng
 * khi chữ to / màn hẹp - không cột nào bên cạnh ép tên sự kiện.
 */
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
      accessibilityLabel={spokenEvent({
        event,
        anniversary,
        next: next && {
          date: fromJulianDay(next.date),
          weekday: weekdayOf(next.date),
          daysAway: describeDaysAway(next.daysAway),
        },
      })}
      accessibilityHint={SPOKEN.hint.editEvent}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <AppText variant="heading" numberOfLines={2}>
        {event.title}
      </AppText>
      <AppText variant="label" color="textMuted">
        {describeOrigin(event)}
        {anniversary > 0 ? ` · lần thứ ${anniversary}` : ''}
      </AppText>
      {next ? (
        <View style={styles.footer}>
          <AppText variant="label" color="event" style={styles.date}>
            {describeSolarDay(next.date)}
          </AppText>
          <Chip
            label={describeDaysAway(next.daysAway)}
            tone={next.daysAway <= 1 ? 'primary' : 'neutral'}
          />
        </View>
      ) : null}
    </Pressable>
  );
});

const useStyles = createThemedStyles(t => ({
  card: {
    gap: t.spacing.xxs,
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
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: t.spacing.sm,
    marginTop: t.spacing.xs,
  },
  date: {
    flexShrink: 1,
  },
}));
