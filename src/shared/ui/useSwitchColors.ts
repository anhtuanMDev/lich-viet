import { Platform } from 'react-native';
import type { SwitchProps } from 'react-native';
import { useTheme } from '@shared/theme';

type SwitchColors = Pick<SwitchProps, 'trackColor' | 'thumbColor'>;

/**
 * Màu Switch theo theme. Android mặc định lấy màu nhấn của hệ thống (xanh ngọc) cho núm
 * → đặt rõ núm đỏ / rãnh hồng nhạt khi bật; iOS giữ núm trắng chuẩn, chỉ đổi màu rãnh.
 */
export function useSwitchColors(value: boolean): SwitchColors {
  const { colors } = useTheme();
  return Platform.OS === 'android'
    ? {
        trackColor: { true: colors.primarySoft, false: colors.border },
        thumbColor: value ? colors.primary : colors.textFaint,
      }
    : { trackColor: { true: colors.primary, false: colors.border } };
}
