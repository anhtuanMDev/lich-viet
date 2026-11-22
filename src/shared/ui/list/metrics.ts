import { Platform } from 'react-native';

export const isIos = Platform.OS === 'ios';

/** Cột icon đầu hàng (dp). */
export const LEADING_WIDTH = Platform.select({ android: 24, default: 20 });

/** Khoảng cách giữa cột icon và chữ (dp). */
export const LEADING_GAP = Platform.select({ android: 16, default: 12 });
