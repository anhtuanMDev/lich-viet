import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';
import { Platform, SectionList, StyleSheet, View } from 'react-native';

import { upcomingEvents } from '@core/events';
import { toJulianDay } from '@core/lunar';
import { useToday } from '@shared/hooks/useToday';
import { createThemedStyles, layout } from '@shared/theme';
import {
  FAB_CLEARANCE,
  Fab,
  Screen,
  SectionHeader,
  useTabBarSpace,
} from '@shared/ui';

import { EventRow } from './components/EventRow';
import { EventsEmptyState } from './components/EventsEmptyState';
import { useEvents } from './eventRepository';

import type { EventRowProps } from './components/EventRow';
import type { CalendarEvent } from '@core/events';
import type { JulianDay } from '@core/lunar';
import type { SectionListRenderItem } from 'react-native';

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
const isAndroid = Platform.OS === 'android';
const renderSectionHeader = ({ section }: { section: Section }) => (
  <SectionHeader title={section.title} spaced />
);

export function EventsScreen() {
  const styles = useStyles();
  const navigation = useNavigation();
  const events = useEvents();
  const today = useToday();
  const tabBarSpace = useTabBarSpace();

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

  const renderItem = useCallback<SectionListRenderItem<Item, Section>>(
    ({ item }) => (
      <EventRow event={item.event} next={item.next} onPress={openEvent} />
    ),
    [openEvent],
  );

  return (
    <View style={styles.root}>
      <Screen scroll={false}>
        <SectionList
          sections={sections}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={<EventsEmptyState onAdd={addEvent} />}
          stickySectionHeadersEnabled={false}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={[
            styles.list,
            { paddingBottom: tabBarSpace + FAB_CLEARANCE },
          ]}
        />
      </Screen>
      <Fab icon="add" label="Thêm sự kiện" onPress={addEvent} />
    </View>
  );
}

function Separator() {
  const styles = useStyles();
  return <View style={styles.separator} />;
}

const useStyles = createThemedStyles(theme => ({
  root: { flex: 1 },
  // Màn rộng: danh sách không kéo dài quá tầm đọc.
  list: {
    flexGrow: 1,
    width: '100%',
    maxWidth: layout.readableWidth,
    alignSelf: 'center',
  },
  // Material không kẻ giữa các hàng danh sách.
  separator: {
    height: isAndroid ? 0 : StyleSheet.hairlineWidth,
    marginLeft: theme.gutter,
    backgroundColor: theme.colors.separator,
  },
}));
