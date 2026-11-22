import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { SPOKEN } from '@core/a11y';
import { SUPPORTED_YEAR_RANGE } from '@core/lunar';
import type { MonthKey } from '@core/lunar';
import { createThemedStyles, useTheme } from '@shared/theme';
import { AppText, Button, Icon } from '@shared/ui';
import type { IconName } from '@shared/ui';
import {
  MONTH_NUMBERS,
  YEARS_PER_PAGE,
  yearPageStart,
  yearsOfPage,
} from '../monthPicker';

export interface MonthPickerModalProps {
  readonly visible: boolean;
  /** Tháng đang xem trên lịch - được đánh dấu chọn. */
  readonly month: MonthKey;
  readonly today: MonthKey;
  readonly onSelect: (month: MonthKey) => void;
  readonly onClose: () => void;
}

/** Bấm tiêu đề tháng trên màn Lịch → chọn nhanh tháng, bấm năm để chọn năm. */
export function MonthPickerModal({
  visible,
  month,
  today,
  onSelect,
  onClose,
}: MonthPickerModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      {/* `key` để mỗi lần mở bắt đầu lại từ tháng đang xem. */}
      {visible ? (
        <PickerBody
          key={`${month.year}-${month.month}`}
          month={month}
          today={today}
          onSelect={onSelect}
          onClose={onClose}
        />
      ) : null}
    </Modal>
  );
}

type Mode = 'month' | 'year';

function PickerBody({
  month,
  today,
  onSelect,
  onClose,
}: Omit<MonthPickerModalProps, 'visible'>) {
  const styles = useStyles();
  const [mode, setMode] = useState<Mode>('month');
  const [year, setYear] = useState(month.year);
  const [pageStart, setPageStart] = useState(() => yearPageStart(month.year));

  const isMonthMode = mode === 'month';
  const canPrev = isMonthMode
    ? year > SUPPORTED_YEAR_RANGE.min
    : pageStart > SUPPORTED_YEAR_RANGE.min;
  const canNext = isMonthMode
    ? year < SUPPORTED_YEAR_RANGE.max
    : pageStart + YEARS_PER_PAGE <= SUPPORTED_YEAR_RANGE.max;
  const step = (direction: -1 | 1) =>
    isMonthMode
      ? setYear(y => y + direction)
      : setPageStart(p => p + direction * YEARS_PER_PAGE);

  const years = yearsOfPage(pageStart);
  const title = isMonthMode
    ? `Năm ${year}`
    : `${pageStart} - ${years[years.length - 1] ?? pageStart}`;

  const openYears = () => {
    setPageStart(yearPageStart(year));
    setMode('year');
  };
  const pickYear = (value: number) => {
    setYear(value);
    setMode('month');
  };

  return (
    <View style={styles.backdrop}>
      <Pressable
        style={styles.dismiss}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel={SPOKEN.close}
      />
      {/* VoiceOver không đọc lọt ra lưới lịch phía sau khi bảng đang mở. */}
      <View style={styles.sheet} accessibilityViewIsModal>
        <View style={styles.header}>
          <StepButton
            icon="chevron_left"
            label={isMonthMode ? SPOKEN.prevYear : SPOKEN.prevYearPage}
            disabled={!canPrev}
            onPress={() => step(-1)}
          />
          <Pressable
            onPress={isMonthMode ? openYears : () => setMode('month')}
            accessibilityRole="button"
            accessibilityHint={
              isMonthMode ? SPOKEN.hint.pickYear : SPOKEN.hint.backToMonths
            }
            style={styles.titleButton}
          >
            <View style={styles.titleRow}>
              <AppText variant="bodyStrong" align="center">
                {title}
              </AppText>
              <Icon
                name={isMonthMode ? 'keyboard_arrow_down' : 'chevron_left'}
                size={20}
                color="primary"
              />
            </View>
          </Pressable>
          <StepButton
            icon="chevron_right"
            label={isMonthMode ? SPOKEN.nextYear : SPOKEN.nextYearPage}
            disabled={!canNext}
            onPress={() => step(1)}
          />
        </View>

        <View style={styles.grid}>
          {isMonthMode
            ? MONTH_NUMBERS.map(m => (
                <GridCell
                  key={m}
                  label={`Tháng ${m}`}
                  selected={year === month.year && m === month.month}
                  current={year === today.year && m === today.month}
                  onPress={() => onSelect({ year, month: m })}
                />
              ))
            : years.map(y => (
                <GridCell
                  key={y}
                  label={String(y)}
                  selected={y === year}
                  current={y === today.year}
                  onPress={() => pickYear(y)}
                />
              ))}
        </View>

        <View style={styles.footer}>
          <Button
            label="Về tháng hiện tại"
            variant="plain"
            onPress={() => onSelect(today)}
          />
        </View>
      </View>
    </View>
  );
}

interface StepButtonProps {
  readonly icon: IconName;
  readonly label: string;
  readonly disabled: boolean;
  readonly onPress: () => void;
}

function StepButton({ icon, label, disabled, onPress }: StepButtonProps) {
  const styles = useStyles();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={styles.step}
    >
      <Icon name={icon} size={24} color={disabled ? 'textFaint' : 'primary'} />
    </Pressable>
  );
}

interface GridCellProps {
  readonly label: string;
  readonly selected: boolean;
  /** Tháng/năm hiện tại - viền nhấn. */
  readonly current: boolean;
  readonly onPress: () => void;
}

function GridCell({ label, selected, current, onPress }: GridCellProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={styles.cellSlot}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={current ? `${label}, hiện tại` : label}
        accessibilityState={{ selected }}
        android_ripple={{ color: colors.fill }}
        style={({ pressed }) => [
          styles.cell,
          current && styles.cellCurrent,
          selected && styles.cellSelected,
          pressed && styles.cellPressed,
        ]}
      >
        <AppText
          variant="subhead"
          color={selected ? 'onPrimary' : current ? 'primary' : 'text'}
          style={selected || current ? styles.cellStrong : null}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {label}
        </AppText>
      </Pressable>
    </View>
  );
}

const useStyles = createThemedStyles(t => ({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: t.spacing.xl,
    backgroundColor: t.colors.scrim,
  },
  dismiss: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  sheet: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 360,
    gap: t.spacing.sm,
    paddingHorizontal: t.spacing.md,
    paddingTop: t.spacing.md,
    paddingBottom: t.spacing.sm,
    borderRadius: t.radius.dialog,
    backgroundColor: t.colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  step: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleButton: {
    flex: 1,
    paddingVertical: t.spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.spacing.xxs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cellSlot: {
    width: '33.333%',
    padding: t.spacing.xxs,
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: t.spacing.xs,
    borderRadius: t.radius.pill,
    overflow: 'hidden',
  },
  cellCurrent: {},
  cellSelected: {
    backgroundColor: t.colors.primary,
  },
  cellPressed: {
    backgroundColor: t.colors.fill,
  },
  cellStrong: {
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
}));
