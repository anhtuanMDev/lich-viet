import { Image, Platform } from 'react-native';

import { useTheme } from '@shared/theme';

import { androidIcons, iosIcons } from './iconAssets';

import type { IconName } from './iconPaths';
import type { ColorTokens } from '@shared/theme';

export type { IconName } from './iconPaths';

const ICONS = Platform.OS === 'android' ? androidIcons : iosIcons;

export interface IconProps {
  readonly name: IconName;
  /** Kích thước (dp). Mặc định 24 - cỡ icon chuẩn của Material. */
  readonly size?: number;
  readonly color?: keyof ColorTokens;
}

/**
 * Icon Material Symbols (bản Rounded trên iOS, Outlined trên Android), ảnh đen được tô
 * màu theo theme. Luôn đi kèm nhãn ở phần tử cha, nên ẩn khỏi trình đọc màn hình.
 */
export function Icon({ name, size = 24, color = 'text' }: IconProps) {
  const { colors } = useTheme();
  return (
    <Image
      source={ICONS[name]}
      accessible={false}
      importantForAccessibility="no"
      style={{ width: size, height: size, tintColor: colors[color] }}
    />
  );
}
