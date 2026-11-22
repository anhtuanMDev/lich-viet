import { Platform, View } from 'react-native';

import { HeaderIconButton } from '@shared/ui';

import type {
  NativeStackHeaderItem,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import type { Theme } from '@shared/theme';
import type { IconName } from '@shared/ui';
import type { SFSymbol } from 'sf-symbols-typescript';

/** Kiểu thanh tiêu đề chung: tiêu đề lớn trên iOS, thanh tiêu đề Material trên Android. */
export function stackScreenOptions({
  colors,
  typography,
}: Theme): NativeStackNavigationOptions {
  return Platform.OS === 'ios'
    ? {
        // Nền, màu chữ tiêu đề để hệ thống tự lo (kính mờ khi cuộn, sáng/tối).
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerTintColor: colors.primary,
        // Không đặt màu thì tiêu đề lấy màu nhấn (đỏ).
        headerTitleStyle: { color: colors.text },
        headerLargeTitleStyle: { color: colors.text },
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colors.background },
      }
    : {
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: {
          color: colors.text,
          fontSize: typography.title.fontSize,
          fontWeight: '400',
        },
        contentStyle: { backgroundColor: colors.background },
      };
}

export interface HeaderAction {
  readonly label: string;
  /** Icon iOS (SF Symbols, nút native). */
  readonly sfSymbol: SFSymbol;
  /** Icon Android (Material Symbols). */
  readonly icon: IconName;
  readonly onPress: () => void;
  /** Ẩn trên Android vì đã có nút nổi (FAB). */
  readonly iosOnly?: boolean;
}

/** Nút bên phải thanh tiêu đề: nút native SF Symbols trên iOS, nút icon 48dp trên Android. */
export function headerActions(
  actions: readonly HeaderAction[],
): NativeStackNavigationOptions {
  if (Platform.OS === 'ios') {
    return {
      unstable_headerRightItems: (): NativeStackHeaderItem[] =>
        actions.map(action => ({
          type: 'button',
          label: action.label,
          icon: { type: 'sfSymbol', name: action.sfSymbol },
          accessibilityLabel: action.label,
          onPress: action.onPress,
        })),
    };
  }
  const visible = actions.filter(action => !action.iosOnly);
  return {
    headerRight: () => (
      <View style={ROW}>
        {visible.map(action => (
          <HeaderIconButton
            key={action.label}
            icon={action.icon}
            label={action.label}
            onPress={action.onPress}
          />
        ))}
      </View>
    ),
  };
}

const ROW = { flexDirection: 'row' } as const;
