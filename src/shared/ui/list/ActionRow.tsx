import { Platform } from 'react-native';

import { Icon } from '../Icon';

import { ListRow } from './ListRow';

import type { IconName } from '../Icon';

const ICON_SIZE = 22;

export interface ActionRowProps {
  readonly label: string;
  readonly onPress: () => void;
  /** Mở màn khác: hiện mũi tên ">" trên iOS. */
  readonly opensScreen?: boolean;
  /** Biểu tượng đầu hàng, cả hai nền tảng. */
  readonly icon?: IconName;
  /**
   * Chỉ Android: biểu tượng Material đầu hàng. Hàng hành động M3 chữ thường nên cần biểu
   * tượng để đọc ra là bấm được; iOS đã có chữ màu nhấn nên không hiện.
   */
  readonly materialIcon?: IconName;
  /** danger: hành động xoá - chữ đỏ, căn giữa trên iOS như app hệ thống. */
  readonly tone?: 'primary' | 'danger';
  readonly hint?: string;
}

/**
 * Hàng danh sách đóng vai nút. iOS: chữ màu nhấn như nút trong bảng hệ thống. Android
 * (Material 3): list item thường - chữ onSurface, biểu tượng onSurfaceVariant - để màu nhấn
 * dành cho tiêu đề mục. Thao tác xoá chữ đỏ trên cả hai.
 */
export function ActionRow({
  label,
  onPress,
  opensScreen = false,
  icon,
  materialIcon,
  tone = 'primary',
  hint,
}: ActionRowProps) {
  const isAndroid = Platform.OS === 'android';
  const isNeutral = tone === 'primary' && isAndroid;
  const leadingIcon = icon ?? (isAndroid ? materialIcon : undefined);
  return (
    <ListRow
      title={label}
      leading={
        leadingIcon ? (
          <Icon
            name={leadingIcon}
            size={ICON_SIZE}
            color={isNeutral ? 'textMuted' : tone}
          />
        ) : undefined
      }
      action={{ onPress, hint, chevron: opensScreen }}
      presentation={{
        titleColor: isNeutral ? 'text' : tone,
        centered: tone === 'danger' && !isAndroid,
      }}
    />
  );
}
