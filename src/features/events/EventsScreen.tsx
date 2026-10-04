import { useCallback, useMemo } from 'react';
import { Pressable, SectionList, View } from 'react-native';
import type { SectionListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { upcomingEvents } from '@core/events';
import type { CalendarEvent } from '@core/events';
import { toJulianDay } from '@core/lunar';
import type { JulianDay } from '@core/lunar';
import { useToday } from '@shared/hooks/useToday';
import { createThemedStyles } from '@shared/theme';
import { AppText, Button, Card, Screen } from '@shared/ui';
import { EventRow } from './components/EventRow';
import type { EventRowProps } from './components/EventRow';
import { useEvents } from './eventRepository';

type Item = Pick<EventRowProps, 'event' | 'next'>;

interface Section {
  readonly title: string;
  readonly data: readonly Item[];
}

function buildSections(events: readonly CalendarEvent[], todayJd: JulianDay) {
  const upcoming = upcomingEvents(events, todayJd);
  const upcomingIds = new Set(upcoming.map(u => u.event.id));
  const past = events
    .filter(event => !upcomingIds.has(event.id))
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const sections: Section[] = [];
  if (upcoming.length > 0) {
    sections.push({
      title: 'Sắp tới',
      data: upcoming.map(({ event, date, daysAway }) => ({
        event,
        next: { date, daysAway },
      })),
    });
  }
  if (past.length > 0) {
    sections.push({
      title: 'Đã qua',
      data: past.map(event => ({ event, next: null })),
    });
  }
  return sections;
}

const keyExtractor = (item: Item) => item.event.id;
const renderSectionHeader = ({ section }: { section: Section }) => (
  <SectionHeader title={section.title} />
);

export function EventsScreen() {
  const styles = useStyles();
  const navigation = useNavigation();
  const events = useEvents();
  const today = useToday();

  const sections = useMemo(
    () => buildSections(events, toJulianDay(today)),
    [events, today],
  );

  const openEvent = useCallback(
    (eventId: string) => navigation.navigate('EventEdit', { eventId }),
    [navigation],
  );
  const addEvent = useCallback(
    () => navigation.navigate('EventEdit'),
    [navigation],
  );
  const openSettings = useCallback(
    () => navigation.navigate('Settings'),
    [navigation],
  );

  const renderItem = useCallback<SectionListRenderItem<Item, Section>>(
    ({ item }) => (
      <EventRow event={item.event} next={item.next} onPress={openEvent} />
    ),
    [openEvent],
  );

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <AppText
          variant="title"
          style={styles.title}
          accessibilityRole="header"
        >
          Sự kiện
        </AppText>
        <Pressable
          onPress={openSettings}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Cài đặt"
        >
          <AppText variant="title" color="textMuted">
            ⚙︎
          </AppText>
        </Pressable>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={EmptyState}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <Button label="+ Thêm sự kiện" onPress={addEvent} />
      </View>
    </Screen>
  );
}

function SectionHeader({ title }: { readonly title: string }) {
  const styles = useStyles();
  return (
    <AppText variant="label" color="textMuted" style={styles.sectionTitle}>
      {title.toUpperCase()}
    </AppText>
  );
}

function Separator() {
  const styles = useStyles();
  return <View style={styles.separator} />;
}

function EmptyState() {
  return (
    <Card>
      <AppText variant="heading">Chưa có sự kiện nào</AppText>
      <AppText color="textMuted">
        Lưu ngày giỗ, sinh nhật âm lịch hay các dịp quan trọng - app sẽ tự tính
        ngày dương lịch tương ứng cho mỗi năm.
      </AppText>
    </Card>
  );
}

const useStyles = createThemedStyles(t => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: t.spacing.lg,
    paddingVertical: t.spacing.md,
  },
  title: {
    flex: 1,
  },
  list: {
    paddingHorizontal: t.spacing.lg,
    paddingBottom: t.spacing.lg,
    flexGrow: 1,
  },
  sectionTitle: {
    letterSpacing: 0.5,
    marginTop: t.spacing.md,
    marginBottom: t.spacing.sm,
  },
  separator: {
    height: t.spacing.sm,
  },
  footer: {
    paddingHorizontal: t.spacing.lg,
    paddingBottom: t.spacing.md,
  },
}));
