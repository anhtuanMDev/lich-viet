import { memo } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { SPOKEN, spokenMonth } from '@core/a11y';
import { createThemedStyles, fontScaleLimit } from '@shared/theme';
import { AppText, Button, Icon } from '@shared/ui';

import { MonthArrowButton } from './MonthArrowButton';

import type { MonthKey } from '@core/lunar';
import type { Theme, ThemedStyles } from '@shared/theme';

export interface MonthHeaderProps {
  readonly month: MonthKey;
  /** VD: "Tháng 9 - 10 năm Bính Ngọ" */
  readonly lunarSubtitle: string;
  readonly showTodayButton: boolean;
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly onToday: () => void;
  /** Bấm tiêu đề → mở bảng chọn nhanh tháng/năm. */
  readonly onPressTitle: () => void;
}

const lowerFirst = (text: string): string =>
  text.charAt(0).toLowerCase() + text.slice(1);

/**
 * Tiêu đề tháng cỡ tiêu đề lớn (như app Lịch), bấm để chọn tháng; dòng dưới là năm và
 * tháng âm tương ứng. Bên phải: "Hôm nay" (khi đang xem tháng khác) và hai nút đổi tháng.
 */
export const MonthHeader = memo(function MonthHeaderView({
  month,
  lunarSubtitle,
  showTodayButton,
  onPrev,
  onNext,
  onToday,
  onPressTitle,
}: MonthHeaderProps) {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable
          onPress={onPressTitle}
          accessibilityRole="button"
          accessibilityLabel={`${spokenMonth(
            month.year,
            month.month,
          )}. ${lunarSubtitle}`}
          accessibilityHint={SPOKEN.hint.pickMonth}
          style={({ pressed }) => [styles.titles, pressed && styles.pressed]}
        >
          {/* Màn Lịch không cuộn: tiêu đề xuống dòng sẽ đẩy lưới lịch ra khỏi màn. */}
          <View style={styles.titleRow}>
            <AppText
              variant="largeTitle"
              maxFontSizeMultiplier={fontScaleLimit.compact}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              style={styles.title}
            >
              Tháng {month.month}
            </AppText>
            <Icon name="keyboard_arrow_down" size={22} color="primary" />
          </View>
          <AppText
            variant="subhead"
            color="textMuted"
            maxFontSizeMultiplier={fontScaleLimit.compact}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {month.year} · {lowerFirst(lunarSubtitle)}
          </AppText>
        </Pressable>
        <View style={styles.actions}>
          {showTodayButton ? (
            <Button
              label="Hôm nay"
              variant={Platform.OS === 'android' ? 'plain' : 'tonal'}
              size="small"
              onPress={onToday}
            />
          ) : null}
          <MonthArrowButton
            label={SPOKEN.prevMonth}
            icon="chevron_left"
            onPress={onPrev}
          />
          <MonthArrowButton
            label={SPOKEN.nextMonth}
            icon="chevron_right"
            onPress={onNext}
          />
        </View>
      </View>
    </View>
  );
});

function monthHeaderStyles(theme: Theme) {
  return {
    container: {
      paddingLeft: theme.gutter,
      paddingRight: theme.spacing.xs,
      paddingTop: theme.spacing.sm,
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    titles: { flex: 1 },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xxs,
    },
    title: { flexShrink: 1 },
    actions: { flexDirection: 'row', alignItems: 'center' },
    pressed: { opacity: 0.5 },
  } satisfies ThemedStyles;
}

const useStyles = createThemedStyles(monthHeaderStyles);
