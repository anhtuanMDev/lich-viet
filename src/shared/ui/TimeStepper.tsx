import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { createThemedStyles, useTheme } from '@shared/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';

import type { IconName } from './Icon';

export interface TimeValue {
  readonly hour: number;
  readonly minute: number;
}

export interface TimeStepperProps {
  readonly value: TimeValue;
  readonly onChange: (value: TimeValue) => void;
  /** Bước nhảy (phút). */
  readonly step?: number;
  readonly label: string;
}

const MINUTES_PER_DAY = 24 * 60;
const pad2 = (n: number) => String(n).padStart(2, '0');
const isAndroid = Platform.OS === 'android';
/** Vùng chạm thêm quanh nút bước để đủ 44pt / 48dp. */
const STEP_HIT_SLOP = Platform.select({ android: 4, default: 6 });
const STEP_ICON_SIZE = Platform.select({ android: 20, default: 18 });

function shift({ hour, minute }: TimeValue, delta: number): TimeValue {
  const total =
    (((hour * 60 + minute + delta) % MINUTES_PER_DAY) + MINUTES_PER_DAY) %
    MINUTES_PER_DAY;
  return { hour: Math.floor(total / 60), minute: total % 60 };
}

export const formatTime = ({ hour, minute }: TimeValue): string =>
  `${pad2(hour)}:${pad2(minute)}`;

/**
 * Giờ + nút bước −/+, đặt ở cuối một hàng danh sách. iOS: cụm nút như UIStepper;
 * Android: hai nút icon viền tròn của Material.
 */
export function TimeStepper({
  value,
  onChange,
  step = 30,
  label,
}: TimeStepperProps) {
  const styles = useStyles();
  const text = formatTime(value);
  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={event =>
        onChange(
          shift(
            value,
            event.nativeEvent.actionName === 'increment' ? step : -step,
          ),
        )
      }
    >
      <AppText variant="bodyStrong" style={styles.value}>
        {text}
      </AppText>
      <View style={isAndroid ? styles.androidButtons : styles.iosStepper}>
        <StepButton
          icon="remove"
          onPress={() => onChange(shift(value, -step))}
        />
        {isAndroid ? null : <View style={styles.iosDivider} />}
        <StepButton icon="add" onPress={() => onChange(shift(value, step))} />
      </View>
    </View>
  );
}

function StepButton({
  icon,
  onPress,
}: {
  readonly icon: IconName;
  readonly onPress: () => void;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={STEP_HIT_SLOP}
      importantForAccessibility="no"
      android_ripple={{ color: colors.fill, borderless: true, radius: 22 }}
      style={({ pressed }) => [
        isAndroid ? styles.androidButton : styles.iosButton,
        pressed && !isAndroid && styles.pressed,
      ]}
    >
      <Icon name={icon} size={STEP_ICON_SIZE} color="text" />
    </Pressable>
  );
}

const useStyles = createThemedStyles(t => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.md,
  },
  value: {
    fontVariant: ['tabular-nums'],
    minWidth: 52,
    textAlign: 'right',
  },
  iosStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: t.colors.fill,
    borderRadius: t.radius.pill,
  },
  iosButton: {
    width: 47,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iosDivider: {
    width: StyleSheet.hairlineWidth,
    height: 18,
    backgroundColor: t.colors.outline,
  },
  pressed: {
    opacity: 0.5,
  },
  androidButtons: {
    flexDirection: 'row',
    gap: t.spacing.sm,
  },
  androidButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: t.colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
