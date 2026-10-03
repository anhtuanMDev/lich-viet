import { useCallback, useMemo } from 'react';
import { FlatList, ScrollView, useWindowDimensions } from 'react-native';
import type { ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { SolarDate } from '@core/lunar';
import { useEvents } from '@features/events';
import { useSettings } from '@features/settings';
import { useToday } from '@shared/hooks/useToday';
import { createThemedStyles } from '@shared/theme';
import { Screen } from '@shared/ui';
import { MonthAgenda } from './components/MonthAgenda';
import { MonthGrid } from './components/MonthGrid';
import { MonthHeader } from './components/MonthHeader';
import { WeekdayHeader } from './components/WeekdayHeader';
import {
  CELL_ASPECT_RATIO,
  MONTH_COUNT,
  indexOfMonth,
  monthAtIndex,
} from './constants';
import { useMonthPager } from './hooks/useMonthPager';
import { lunarSubtitle } from './lunarSubtitle';

const MONTH_INDICES: readonly number[] = Array.from(
  { length: MONTH_COUNT },
  (_, i) => i,
);
const keyExtractor = (index: number) => String(index);

export function CalendarScreen() {
  const styles = useStyles();
  const navigation = useNavigation();
  const today = useToday();
  const events = useEvents();
  const { weekStart } = useSettings();
  const { width } = useWindowDimensions();
  const cellHeight = Math.round((width / 7) * CELL_ASPECT_RATIO);

  const pager = useMonthPager(today, width);
  const visibleMonth = monthAtIndex(pager.index);
  const todayIndex = indexOfMonth(today);

  const subtitle = useMemo(
    () => lunarSubtitle(monthAtIndex(pager.index), weekStart),
    [pager.index, weekStart],
  );

  const openDay = useCallback(
    (date: SolarDate) => navigation.navigate('DayDetail', { date }),
    [navigation],
  );

  const { goTo } = pager;
  const goToday = useCallback(() => goTo(todayIndex), [goTo, todayIndex]);

  const renderMonth = useCallback<ListRenderItem<number>>(
    ({ item }) => {
      const { year, month } = monthAtIndex(item);
      return (
        <MonthGrid
          year={year}
          month={month}
          weekStart={weekStart}
          today={today}
          events={events}
          width={width}
          cellHeight={cellHeight}
          onPressDay={openDay}
        />
      );
    },
    [weekStart, today, events, width, cellHeight, openDay],
  );

  return (
    <Screen scroll={false}>
      <MonthHeader
        month={visibleMonth}
        lunarSubtitle={subtitle}
        showTodayButton={pager.index !== todayIndex}
        onPrev={pager.goPrev}
        onNext={pager.goNext}
        onToday={goToday}
      />
      <WeekdayHeader weekStart={weekStart} />
      <FlatList
        ref={pager.listRef}
        data={MONTH_INDICES}
        renderItem={renderMonth}
        keyExtractor={keyExtractor}
        getItemLayout={pager.getItemLayout}
        initialScrollIndex={pager.initialIndex}
        onMomentumScrollEnd={pager.onMomentumScrollEnd}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        // Chỉ giữ tháng hiện tại và hai tháng kề bên trong bộ nhớ.
        windowSize={3}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        // renderItem đổi khi tuần/sự kiện/hôm nay đổi; extraData buộc FlatList vẽ lại.
        extraData={renderMonth}
        style={[styles.pager, { height: cellHeight * 6 }]}
      />
      <ScrollView style={styles.agenda} contentContainerStyle={styles.below}>
        <MonthAgenda
          year={visibleMonth.year}
          month={visibleMonth.month}
          weekStart={weekStart}
          events={events}
          onPressDay={openDay}
        />
      </ScrollView>
    </Screen>
  );
}

const useStyles = createThemedStyles(t => ({
  // ScrollView/FlatList mặc định flexShrink: 1 → danh sách sự kiện dài sẽ ép lưới lịch
  // thấp lại và đè lên hàng cuối. Lưới giữ cố định 6 hàng; phần sự kiện tự cuộn.
  pager: {
    flexGrow: 0,
    flexShrink: 0,
  },
  agenda: {
    flex: 1,
  },
  below: {
    padding: t.spacing.lg,
  },
}));
