import { Pressable, View } from 'react-native';
import { createThemedStyles } from '@shared/theme';
import { AppText } from './AppText';

export interface SegmentOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

export interface SegmentedControlProps<T extends string> {
  readonly options: readonly SegmentOption<T>[];
  readonly value: T;
  readonly onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const styles = useStyles();
  return (
    <View style={styles.track} accessibilityRole="tablist">
      {options.map(option => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={[styles.segment, selected && styles.selected]}
          >
            <AppText
              variant="label"
              color={selected ? 'onPrimary' : 'textMuted'}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const useStyles = createThemedStyles(t => ({
  track: {
    flexDirection: 'row',
    backgroundColor: t.colors.surfaceMuted,
    borderRadius: t.radius.pill,
    padding: t.spacing.xxs,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: t.spacing.sm,
    borderRadius: t.radius.pill,
  },
  selected: {
    backgroundColor: t.colors.primary,
  },
}));
