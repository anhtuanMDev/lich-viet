import { Platform, View } from 'react-native';

import { createThemedStyles } from '@shared/theme';

import { Segment } from './segmented/Segment';

import type { SegmentOption } from './types/segmented';

export type { SegmentOption } from './types/segmented';

export interface SegmentedControlProps<T extends string> {
  readonly options: readonly SegmentOption<T>[];
  readonly value: T;
  readonly onChange: (value: T) => void;
}

const isAndroid = Platform.OS === 'android';

/**
 * iOS: rãnh xám, ô chọn trắng nổi (như UISegmentedControl).
 * Android: nút phân đoạn Material 3 - viền mảnh, ô chọn tô màu kèm dấu tích.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const styles = useStyles();
  return (
    <View style={styles.track} accessibilityRole="tablist">
      {options.map((option, index) => (
        <Segment
          key={option.value}
          label={option.label}
          spokenLabel={option.spokenLabel ?? option.label}
          isSelected={option.value === value}
          hasDivider={index > 0}
          onPress={() => onChange(option.value)}
        />
      ))}
    </View>
  );
}

const useStyles = createThemedStyles(theme => ({
  track: isAndroid
    ? {
        flexDirection: 'row',
        borderRadius: theme.radius.pill,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        overflow: 'hidden',
      }
    : {
        flexDirection: 'row',
        backgroundColor: theme.colors.fill,
        borderRadius: theme.radius.pill,
        padding: 2,
      },
}));
