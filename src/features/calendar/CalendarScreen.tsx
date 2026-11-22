import { useCallback, useMemo, useState } from 'react';
import { FlatList, ScrollView, View, useWindowDimensions } from 'react-native';
import type { ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { spokenMonth } from '@core/a11y';
import type { MonthKey, SolarDate } from '@core/lunar';
import { useEvents } from '@features/events';
import { useSettings } from '@features/settings';
import { useAnnounce } from '@shared/a11y';
import { useToday } from '@shared/hooks/useToday';
import { createThemedStyles, layout } from '@shared/theme';
import { Screen, useTabBarSpace } from '@shared/ui';
import { MonthAgenda } from './components/MonthAgenda';
import { MonthGrid } from './components/MonthGrid';
import { MonthHeader } from './components/MonthHeader';
import { MonthPickerModal } from './components/MonthPickerModal';
import { WeekdayHeader } from './components/WeekdayHeader';
import {
  MONTH_COUNT,
  cellHeightFor,
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
/** Khoảng trống cuối danh sách "Trong tháng" (dp). */
const END_SPACE = 32;

export function CalendarScreen() {
  const styles = useStyles();
  const navigation = useNavigation();
  const today = useToday();
  const events = useEvents();
  const { weekStart } = useSettings();
  const { width: windowWidth, fontScale } = useWindowDimensions();
  // Màn rộng (iPad, tablet): cột lịch có bề rộng tối đa và căn giữa để ô gần vuông.
  const width = Math.min(windowWidth, layout.calendarWidth);
  const cellHeight = cellHeightFor(fontScale);
  const tabBarSpace = useTabBarSpace();

  const pager = useMonthPager(today, width);
  const visibleMonth = monthAtIndex(pager.index);
  const todayIndex = indexOfMonth(today);
  // Vuốt / bấm mũi tên sang tháng khác: báo tháng mới cho người dùng trình đọc màn hình.
  useAnnounce(spokenMonth(visibleMonth.year, visibleMonth.month), {
    always: true,
  });

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

  const [pickerVisible, setPickerVisible] = useState(false);
  const openPicker = useCallback(() => setPickerVisible(true), []);
  const closePicker = useCallback(() => setPickerVisible(false), []);
  const pickMonth = useCallback(
    (month: MonthKey) => {
      setPickerVisible(false);
      // Nhảy xa (VD sang năm khác) không chạy animation qua từng tháng.
      const target = indexOfMonth(month);
      goTo(target, Math.abs(target - pager.index) <= 1);
    },
    [goTo, pager.index],
  );

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
    // Màn này tự vẽ tiêu đề (tháng bấm được), nên tự chừa vùng an toàn phía trên.
    <Screen scroll={false} edges={['top', 'left', 'right']}>
      <View style={[styles.column, { width }]}>
        <MonthHeader
          month={visibleMonth}
          lunarSubtitle={subtitle}
          showTodayButton={pager.index !== todayIndex}
          onPrev={pager.goPrev}
          onNext={pager.goNext}
          onToday={goToday}
          onPressTitle={openPicker}
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
          // +1: hàng cuối không bị cắt mất đường kẻ mảnh làm tròn.
          style={[styles.pager, { height: cellHeight * 6 + 1 }]}
        />
        <ScrollView
          style={styles.agenda}
          contentContainerStyle={[
            styles.below,
            tabBarSpace > 0 && { paddingBottom: tabBarSpace + END_SPACE },
          ]}
          contentInsetAdjustmentBehavior="automatic"
        >
          <MonthAgenda
            year={visibleMonth.year}
            month={visibleMonth.month}
            weekStart={weekStart}
            events={events}
            onPressDay={openDay}
          />
        </ScrollView>
      </View>
      <MonthPickerModal
        visible={pickerVisible}
        month={visibleMonth}
        today={today}
        onSelect={pickMonth}
        onClose={closePicker}
      />
    </Screen>
  );
}

const useStyles = createThemedStyles(t => ({
  column: {
    flex: 1,
    alignSelf: 'center',
  },
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
    paddingBottom: t.spacing.xxl,
  },
}));
