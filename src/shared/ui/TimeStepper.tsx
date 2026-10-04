import { Pressable, View } from 'react-native';
import { createThemedStyles } from '@shared/theme';
import { AppText } from './AppText';

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

function shift({ hour, minute }: TimeValue, delta: number): TimeValue {
  const total =
    (((hour * 60 + minute + delta) % MINUTES_PER_DAY) + MINUTES_PER_DAY) %
    MINUTES_PER_DAY;
  return { hour: Math.floor(total / 60), minute: total % 60 };
}

export const formatTime = ({ hour, minute }: TimeValue): string =>
  `${pad2(hour)}:${pad2(minute)}`;

/** Chọn giờ bằng nút −/+ - đủ dùng cho giờ nhắc, không cần thư viện picker native. */
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
      <StepButton symbol="−" onPress={() => onChange(shift(value, -step))} />
      <AppText variant="title" style={styles.value}>
        {text}
      </AppText>
      <StepButton symbol="+" onPress={() => onChange(shift(value, step))} />
    </View>
  );
}

function StepButton({
  symbol,
  onPress,
}: {
  readonly symbol: string;
  readonly onPress: () => void;
}) {
  const styles = useStyles();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      importantForAccessibility="no"
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <AppText variant="title" color="primary">
        {symbol}
      </AppText>
    </Pressable>
  );
}

const useStyles = createThemedStyles(t => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.spacing.lg,
  },
  value: {
    minWidth: 88,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: t.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.primarySoft,
  },
  pressed: {
    opacity: 0.6,
  },
}));
