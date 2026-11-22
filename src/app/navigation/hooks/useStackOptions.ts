import { useMemo } from 'react';

import { useTheme } from '@shared/theme';

import { stackScreenOptions } from '../headerOptions';

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

/** Kiểu thanh tiêu đề chung theo theme hiện tại (sáng/tối). */
export function useStackOptions(): NativeStackNavigationOptions {
  const theme = useTheme();
  return useMemo(() => stackScreenOptions(theme), [theme]);
}
