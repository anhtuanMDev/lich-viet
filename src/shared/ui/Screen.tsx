import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Keyboard, ScrollView, TextInput, View } from 'react-native';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewInstance,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context';
import { createThemedStyles, layout } from '@shared/theme';
import { FAB_CLEARANCE } from './Fab';
import { RevealInputContext } from './revealInput';
import { useTabBarSpace } from './tabBarSpace';

export interface ScreenProps {
  readonly children: ReactNode;
  /** Mặc định cuộn được; tắt khi con đã là list ảo hoá (FlatList…). */
  readonly scroll?: boolean;
  /**
   * Cạnh cần chừa vùng an toàn. Mặc định chỉ hai bên: thanh tiêu đề native và thanh tab
   * đã lo phần trên/dưới (ScrollView tự chỉnh inset với contentInsetAdjustmentBehavior).
   */
  readonly edges?: readonly Edge[];
  /** Chừa chỗ cuối trang cho nút nổi (FAB) của Android. */
  readonly fabSpace?: boolean;
  /** Màn nằm trong tab: chừa chỗ cho thanh điều hướng Android (iOS tự chỉnh). */
  readonly inTabs?: boolean;
}

const DEFAULT_EDGES: readonly Edge[] = ['left', 'right'];

/** Khoảng trống cuối trang (dp) để hàng cuối không sát thanh điều hướng. */
const END_SPACE = 32;

/** Khoảng hở giữa ô đang nhập và mép bàn phím. */
const KEYBOARD_GAP = 24;

export function Screen({
  children,
  scroll = true,
  edges = DEFAULT_EDGES,
  fabSpace = false,
  inTabs = false,
}: ScreenProps) {
  const styles = useStyles();
  const tabBarSpace = useTabBarSpace();
  return (
    <SafeAreaView style={styles.root} edges={edges}>
      {scroll ? (
        <KeyboardAwareScroll
          contentStyle={[
            styles.content,
            fabSpace && styles.fabSpace,
            inTabs &&
              tabBarSpace > 0 && {
                paddingBottom:
                  tabBarSpace + (fabSpace ? FAB_CLEARANCE : END_SPACE),
              },
          ]}
        >
          {children}
        </KeyboardAwareScroll>
      ) : (
        <View style={styles.fill}>{children}</View>
      )}
    </SafeAreaView>
  );
}

interface Frame {
  readonly top: number;
  readonly bottom: number;
}

/**
 * ScrollView tự chừa chỗ cho bàn phím và cuộn ô đang nhập lên trên bàn phím.
 *
 * Android bật edge-to-edge (`edgeToEdgeEnabled`) nên `adjustResize` không còn thu nhỏ cửa
 * sổ; iOS chưa bao giờ tự làm. Vì vậy đo phần ScrollView bị bàn phím che rồi thêm đệm dưới.
 */
function KeyboardAwareScroll({
  children,
  contentStyle,
}: {
  readonly children: ReactNode;
  readonly contentStyle: StyleProp<ViewStyle>;
}) {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const offsetY = useRef(0);
  const frame = useRef<Frame | null>(null);
  /** Toạ độ (trong cửa sổ) mép trên bàn phím; null khi bàn phím ẩn. */
  const keyboardTop = useRef<number | null>(null);
  const [overlap, setOverlap] = useState(0);

  const measureFrame = useCallback(
    (then?: () => void) =>
      scrollRef.current?.measureInWindow((_x, y, _w, height) => {
        frame.current = { top: y, bottom: y + height };
        then?.();
      }),
    [],
  );

  const reveal = useCallback(() => {
    const input = TextInput.State.currentlyFocusedInput();
    const box = frame.current;
    const kbTop = keyboardTop.current;
    if (!input || !box || kbTop === null) {
      return;
    }
    input.measureInWindow((_x, y, _w, height) => {
      const visibleTop = box.top + KEYBOARD_GAP;
      const visibleBottom = Math.min(box.bottom, kbTop) - KEYBOARD_GAP;
      let delta = 0;
      if (y + height > visibleBottom) {
        // Ô cao hơn vùng nhìn thấy (ghi chú nhiều dòng) → ưu tiên thấy mép trên.
        delta = Math.min(y + height - visibleBottom, y - visibleTop);
      } else if (y < visibleTop) {
        delta = y - visibleTop;
      }
      if (delta !== 0) {
        scrollRef.current?.scrollTo({
          y: Math.max(0, offsetY.current + delta),
          animated: true,
        });
      }
    });
  }, []);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', e => {
      keyboardTop.current = e.endCoordinates.screenY;
      measureFrame(() => {
        const box = frame.current;
        setOverlap(
          box ? Math.max(0, box.bottom - e.endCoordinates.screenY) : 0,
        );
        // Chờ đệm mới được áp dụng rồi mới cuộn, nếu không sẽ không cuộn quá cuối nội dung.
        requestAnimationFrame(reveal);
      });
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      keyboardTop.current = null;
      setOverlap(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, [measureFrame, reveal]);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    offsetY.current = e.nativeEvent.contentOffset.y;
  }, []);

  // Chuyển sang ô khác khi bàn phím đang mở: không có keyboardDidShow mới.
  const revealSoon = useCallback(() => {
    requestAnimationFrame(reveal);
  }, [reveal]);

  const contentContainerStyle = useMemo(
    () => [
      contentStyle,
      overlap > 0 && { paddingBottom: overlap + KEYBOARD_GAP },
    ],
    [contentStyle, overlap],
  );

  return (
    <RevealInputContext.Provider value={revealSoon}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={contentContainerStyle}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        // Trong formSheet Android (Chi tiết ngày): bottom sheet chỉ nhường thao tác kéo cho
        // nội dung khi ScrollView hỗ trợ nested scroll; thiếu cờ này sheet bị kéo xuống
        // dù nội dung chưa cuộn về đầu.
        nestedScrollEnabled
        onScroll={onScroll}
        scrollEventThrottle={16}
        onLayout={() => measureFrame()}
      >
        {children}
      </ScrollView>
    </RevealInputContext.Provider>
  );
}

const useStyles = createThemedStyles(t => ({
  root: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  fill: {
    flex: 1,
  },
  // Màn rộng: nội dung không kéo dài quá tầm đọc (iPad ngang, tablet Android) và nằm giữa,
  // như readableContentGuide của UIKit.
  content: {
    width: '100%',
    maxWidth: layout.readableWidth,
    alignSelf: 'center',
    paddingBottom: t.spacing.xxl,
  },
  fabSpace: {
    paddingBottom: FAB_CLEARANCE,
  },
}));
