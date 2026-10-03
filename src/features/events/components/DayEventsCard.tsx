import { useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { anniversaryAt, eventsByDay } from '@core/events';
import { fromJulianDay } from '@core/lunar';
import type { JulianDay } from '@core/lunar';
import { createThemedStyles } from '@shared/theme';
import { AppText, Button, Card } from '@shared/ui';
import { useEvents } from '../eventRepository';
import { describeOrigin } from '../formatEvent';

/** Sự kiện cá nhân rơi vào một ngày + nút thêm sự kiện cho chính ngày đó. */
export function DayEventsCard({ jd }: { readonly jd: JulianDay }) {
  const styles = useStyles();
  const navigation = useNavigation();
  const events = useEvents();
  const dayEvents = useMemo(
    () => eventsByDay(events, jd, jd).get(jd) ?? [],
    [events, jd],
  );

  const addEvent = useCallback(
    () => navigation.navigate('EventEdit', { date: fromJulianDay(jd) }),
    [jd, navigation],
  );

  return (
    <Card title="Sự kiện">
      {dayEvents.map(event => {
        const anniversary =
          event.repeat === 'yearly' ? anniversaryAt(event, jd) : 0;
        return (
          <Pressable
            key={event.id}
            onPress={() =>
              navigation.navigate('EventEdit', { eventId: event.id })
            }
            accessibilityRole="button"
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <View style={styles.marker} />
            <View style={styles.body}>
              <AppText variant="heading">{event.title}</AppText>
              <AppText variant="label" color="textMuted">
                {describeOrigin(event)}
                {anniversary > 0 ? ` · lần thứ ${anniversary}` : ''}
              </AppText>
            </View>
          </Pressable>
        );
      })}
      <Button
        label="+ Thêm sự kiện vào ngày này"
        variant="secondary"
        onPress={addEvent}
      />
    </Card>
  );
}

const useStyles = createThemedStyles(t => ({
  row: {
    flexDirection: 'row',
    gap: t.spacing.md,
    paddingVertical: t.spacing.xs,
    borderRadius: t.radius.sm,
  },
  pressed: {
    backgroundColor: t.colors.surfaceMuted,
  },
  marker: {
    width: 4,
    borderRadius: 2,
    backgroundColor: t.colors.event,
  },
  body: {
    flex: 1,
    gap: t.spacing.xxs,
  },
}));
