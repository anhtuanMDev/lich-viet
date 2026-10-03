import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { darkTheme, lightTheme } from './tokens';
import type { Theme } from './tokens';

const ThemeContext = createContext<Theme>(lightTheme);

/** 'system' = theo cài đặt sáng/tối của điện thoại. */
export type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeProviderProps {
  readonly mode?: ThemeMode;
  readonly children: ReactNode;
}

export function ThemeProvider({
  mode = 'system',
  children,
}: ThemeProviderProps) {
  const scheme = useColorScheme();
  const isDark = mode === 'system' ? scheme === 'dark' : mode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = (): Theme => useContext(ThemeContext);

/**
 * Khai báo style phụ thuộc theme một lần ở module scope; StyleSheet chỉ được tạo lại
 * khi theme đổi (sáng ↔ tối), không phải mỗi lần render.
 *
 *   const useStyles = createThemedStyles(t => ({ box: { backgroundColor: t.colors.surface } }));
 *   const styles = useStyles();
 */
type NamedStyles = Record<string, ViewStyle | TextStyle | ImageStyle>;

export function createThemedStyles<S extends NamedStyles>(
  // `& NamedStyles` giữ kiểu literal ('row', 'center'…) giống StyleSheet.create.
  factory: (theme: Theme) => S & NamedStyles,
): () => Readonly<S> {
  const cache = new WeakMap<Theme, Readonly<S>>();
  return function useThemedStyles() {
    const theme = useTheme();
    return useMemo(() => {
      const cached = cache.get(theme);
      if (cached) {
        return cached;
      }
      const styles = StyleSheet.create(factory(theme));
      cache.set(theme, styles);
      return styles;
    }, [theme]);
  };
}
