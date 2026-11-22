import { Platform, Pressable } from 'react-native';

import { createThemedStyles, fontScaleLimit, useTheme } from '@shared/theme';

import { AppText } from '../AppText';
import { Icon } from '../Icon';

const isAndroid = Platform.OS === 'android';
const CHECK_SIZE = 18;

export interface SegmentProps {
  readonly label: string;
  readonly spokenLabel: string;
  readonly isSelected: boolean;
  /** Không phải phân đoạn đầu: Android kẻ vạch ngăn bên trái. */
  readonly hasDivider: boolean;
  readonly onPress: () => void;
}

/**
 * Một phân đoạn. iOS: ô chọn trắng nổi trên rãnh xám. Android (Material 3): ô chọn tô màu
 * secondary container kèm dấu tích, các ô ngăn bằng vạch viền.
 */
export function Segment({
  label,
  spokenLabel,
  isSelected,
  hasDivider,
  onPress,
}: SegmentProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={spokenLabel}
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      android_ripple={{ color: colors.fill }}
      style={[
        styles.segment,
        isAndroid && hasDivider && styles.divider,
        isSelected && styles.selected,
      ]}
    >
      {isAndroid && isSelected ? (
        <Icon name="check" size={CHECK_SIZE} color="onSecondaryContainer" />
      ) : null}
      <AppText
        variant={isAndroid ? 'button' : 'footnote'}
        color={isAndroid && isSelected ? 'onSecondaryContainer' : 'text'}
        style={isSelected ? styles.selectedLabel : null}
        // Một dòng: chữ xuống hàng làm ô cao lệch nhau. Không dùng adjustsFontSizeToFit: trên
        // Android nó đo sai bề rộng và cắt mất chữ cuối ("Trước 1 ngày" thành "Trước 1").
        numberOfLines={1}
        maxFontSizeMultiplier={fontScaleLimit.compact}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const useStyles = createThemedStyles(theme => ({
  // Chia chỗ theo độ dài nhãn: nhãn dài như "Đúng ngày" không bị co nhỏ hẳn.
  segment: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    minWidth: 56,
    minHeight: theme.controlSize.segment,
    flexDirection: 'row',
    gap: theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: isAndroid ? theme.spacing.md : theme.spacing.sm,
    borderRadius: isAndroid ? 0 : theme.radius.pill,
  },
  divider: {
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.outline,
  },
  selected: isAndroid
    ? { backgroundColor: theme.colors.secondaryContainer }
    : {
        backgroundColor: theme.colors.segmentThumb,
        shadowColor: theme.colors.shadow,
        shadowOpacity: 0.12,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
  selectedLabel: {
    fontWeight: isAndroid ? '500' : '600',
  },
}));
