import { createThemedStyles } from '@shared/theme';

import { AppText } from '../AppText';

import { isIos } from './metrics';

/**
 * Tiêu đề một mục danh sách. iOS: chữ đậm màu thường. Android: subheader Material
 * (titleSmall, màu primary).
 */
export function SectionHeader({
  title,
  spaced = false,
}: {
  readonly title: string;
  /** Tự chừa khoảng trống phía trên (khi không nằm trong Section, VD SectionList). */
  readonly spaced?: boolean;
}) {
  const styles = useStyles();
  return (
    <AppText
      variant="headline"
      color={isIos ? 'text' : 'primary'}
      accessibilityRole="header"
      style={[styles.title, spaced && styles.spaced]}
    >
      {title}
    </AppText>
  );
}

const useStyles = createThemedStyles(theme => ({
  title: {
    paddingHorizontal: theme.gutter,
    paddingBottom: isIos ? theme.spacing.xs : theme.spacing.sm,
  },
  spaced: {
    paddingTop: isIos ? theme.spacing.xl : theme.spacing.lg,
  },
}));
