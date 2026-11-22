import { Children, Fragment, isValidElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { createThemedStyles, useTheme } from '@shared/theme';

import { AppText } from '../AppText';

import { LEADING_GAP, LEADING_WIDTH, isIos } from './metrics';
import { SectionHeader } from './SectionHeader';

import type { Theme, ThemedStyles } from '@shared/theme';
import type { ReactNode } from 'react';

export interface SectionProps {
  readonly title?: string;
  /** Ghi chú dưới mục (chữ nhỏ, màu phụ). */
  readonly footer?: string;
  /**
   * Đường kẻ giữa các hàng bắt đầu từ chữ (mặc định), sau cột icon, hoặc sau một cột
   * đầu hàng rộng tuỳ ý (số dp, VD cột ngày ở "Trong tháng").
   */
  readonly separatorInset?: 'text' | 'leading' | number;
  /** Tắt đường kẻ giữa các con (mục chứa ô nhập, không phải danh sách hàng). */
  readonly separators?: boolean;
  readonly children?: ReactNode;
}

function separatorIndent(
  inset: SectionProps['separatorInset'],
  gutter: number,
): number {
  if (inset === 'leading') {
    return gutter + LEADING_WIDTH + LEADING_GAP;
  }
  return typeof inset === 'number' ? gutter + inset + LEADING_GAP : gutter;
}

/**
 * Một mục nội dung đặt thẳng trên nền màn hình - không khung, không thẻ.
 * iOS: tiêu đề đậm, các hàng ngăn bằng đường kẻ mảnh. Android: tiêu đề màu primary
 * (subheader Material), các hàng không kẻ.
 */
export function Section({
  title,
  footer,
  separatorInset = 'text',
  separators = true,
  children,
}: SectionProps) {
  const styles = useStyles();
  const { gutter } = useTheme();
  const rows = Children.toArray(children).filter(isValidElement);
  const indent = { marginLeft: separatorIndent(separatorInset, gutter) };
  const showSeparators = isIos && separators;
  return (
    <View style={styles.section}>
      {title ? <SectionHeader title={title} /> : null}
      {rows.map((row, index) => (
        <Fragment key={row.key ?? index}>
          {showSeparators && index > 0 ? (
            <View style={[styles.separator, indent]} />
          ) : null}
          {row}
        </Fragment>
      ))}
      {footer ? (
        <AppText variant="footnote" color="textMuted" style={styles.footer}>
          {footer}
        </AppText>
      ) : null}
    </View>
  );
}

function sectionStyles(theme: Theme) {
  return {
    section: {
      paddingTop: isIos ? theme.spacing.xl : theme.spacing.lg,
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.separator,
    },
    footer: {
      paddingHorizontal: theme.gutter,
      paddingTop: theme.spacing.xs,
    },
  } satisfies ThemedStyles;
}

const useStyles = createThemedStyles(sectionStyles);
