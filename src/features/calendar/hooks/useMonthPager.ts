import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import type { MonthKey } from '@core/lunar';
import { MONTH_COUNT, indexOfMonth } from '../constants';

const clampIndex = (index: number): number =>
  Math.min(MONTH_COUNT - 1, Math.max(0, index));

/**
 * Điều khiển danh sách tháng vuốt ngang. Chỉ số trang là nguồn sự thật duy nhất;
 * tháng hiển thị được suy ra từ đó.
 */
export function useMonthPager(initialMonth: MonthKey, pageWidth: number) {
  const listRef = useRef<FlatList<number>>(null);
  const [index, setIndex] = useState(() => indexOfMonth(initialMonth));
  const [initialIndex] = useState(index);

  const goTo = useCallback((target: number, animated = true) => {
    const next = clampIndex(target);
    listRef.current?.scrollToIndex({ index: next, animated });
    setIndex(next);
  }, []);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setIndex(
        clampIndex(Math.round(event.nativeEvent.contentOffset.x / pageWidth)),
      );
    },
    [pageWidth],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<number> | null | undefined, i: number) => ({
      length: pageWidth,
      offset: pageWidth * i,
      index: i,
    }),
    [pageWidth],
  );

  // Xoay màn hình / đổi kích thước cửa sổ: giữ nguyên tháng đang xem.
  // Lần mount đầu đã có initialScrollIndex nên bỏ qua.
  const indexRef = useRef(index);
  const widthRef = useRef(pageWidth);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);
  useEffect(() => {
    if (widthRef.current !== pageWidth) {
      widthRef.current = pageWidth;
      listRef.current?.scrollToIndex({
        index: indexRef.current,
        animated: false,
      });
    }
  }, [pageWidth]);

  return {
    listRef,
    index,
    initialIndex,
    goTo,
    goPrev,
    goNext,
    onMomentumScrollEnd,
    getItemLayout,
  };
}
