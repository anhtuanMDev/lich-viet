import { Pressable, View } from 'react-native';
import { createThemedStyles, fontScaleLimit } from '@shared/theme';
import { AppText } from './AppText';

export interface SegmentOption<T extends string> {
  readonly value: T;
  readonly label: string;
  /** Câu đọc cho trình đọc màn hình khi nhãn hiển thị viết tắt (xem core/a11y). */
  readonly spokenLabel?: string;
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
            accessibilityLabel={option.spokenLabel ?? option.label}
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={[styles.segment, selected && styles.selected]}
          >
            <AppText
              variant="label"
              color={selected ? 'onPrimary' : 'textMuted'}
              // Một dòng: chữ xuống hàng làm ô cao lệch nhau và nền chọn méo thành hình tròn.
              numberOfLines={1}
              maxFontSizeMultiplier={fontScaleLimit.compact}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
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
  // Chia chỗ theo độ dài nhãn (không chia đều): nhãn dài như "Đúng ngày" không bị co nhỏ
  // hẳn so với "1 ngày" khi màn hẹp hoặc chữ to.
  segment: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    // Nhãn ngắn ("Tắt") không thu thành chấm tròn.
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: t.spacing.sm,
    paddingHorizontal: t.spacing.xs,
    borderRadius: t.radius.pill,
  },
  selected: {
    backgroundColor: t.colors.primary,
  },
}));
