import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { SUPPORTED_YEAR_RANGE } from '@core/lunar';
import type { MonthKey } from '@core/lunar';
import { createThemedStyles } from '@shared/theme';
import { AppText, Button } from '@shared/ui';
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
        accessibilityLabel="Đóng"
      />
      <View style={styles.sheet}>
        <View style={styles.header}>
          <StepButton
            symbol="‹"
            label={isMonthMode ? 'Năm trước' : '12 năm trước'}
            disabled={!canPrev}
            onPress={() => step(-1)}
          />
          <Pressable
            onPress={isMonthMode ? openYears : () => setMode('month')}
            accessibilityRole="button"
            accessibilityHint={
              isMonthMode ? 'Chọn năm khác' : 'Quay lại chọn tháng'
            }
            style={styles.titleButton}
          >
            <AppText variant="heading" align="center">
              {title} {isMonthMode ? '▾' : '▴'}
            </AppText>
          </Pressable>
          <StepButton
            symbol="›"
            label={isMonthMode ? 'Năm sau' : '12 năm sau'}
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

        <Button
          label="Về tháng hiện tại"
          variant="secondary"
          onPress={() => onSelect(today)}
        />
      </View>
    </View>
  );
}

interface StepButtonProps {
  readonly symbol: string;
  readonly label: string;
  readonly disabled: boolean;
  readonly onPress: () => void;
}

function StepButton({ symbol, label, disabled, onPress }: StepButtonProps) {
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
      <AppText variant="title" color={disabled ? 'textFaint' : 'textMuted'}>
        {symbol}
      </AppText>
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
  return (
    <View style={styles.cellSlot}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        style={({ pressed }) => [
          styles.cell,
          current && styles.cellCurrent,
          selected && styles.cellSelected,
          pressed && styles.cellPressed,
        ]}
      >
        <AppText
          variant="label"
          color={selected ? 'onPrimary' : current ? 'primary' : 'text'}
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
    padding: t.spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.45)',
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
    maxWidth: 400,
    gap: t.spacing.md,
    padding: t.spacing.lg,
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  step: {
    paddingHorizontal: t.spacing.md,
  },
  titleButton: {
    flex: 1,
    paddingVertical: t.spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cellSlot: {
    width: '33.333%',
    padding: t.spacing.xs,
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: t.spacing.xs,
    borderRadius: t.radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: t.colors.surfaceMuted,
  },
  cellCurrent: {
    borderColor: t.colors.primary,
  },
  cellSelected: {
    backgroundColor: t.colors.primary,
    borderColor: t.colors.primary,
  },
  cellPressed: {
    opacity: 0.7,
  },
}));
