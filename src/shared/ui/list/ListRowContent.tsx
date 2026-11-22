import { View } from 'react-native';

import { createThemedStyles } from '@shared/theme';

import { AppText } from '../AppText';
import { Icon } from '../Icon';

import { ListRowText } from './ListRowText';
import { LEADING_WIDTH, isIos } from './metrics';

import type { ListRowProps } from '../types/list';

const CHEVRON_SIZE = 18;

/** Bên trong một hàng: cột icon, chữ, giá trị, phần tử cuối, mũi tên (iOS). */
export function ListRowContent({
  title,
  subtitle,
  value,
  leading,
  trailing,
  action,
  presentation = {},
}: ListRowProps) {
  const styles = useStyles();
  const { leadingWidth = LEADING_WIDTH } = presentation;
  return (
    <>
      {leading === undefined ? null : (
        <View style={[styles.leading, { width: leadingWidth }]}>{leading}</View>
      )}
      <ListRowText
        title={title}
        subtitle={subtitle}
        titleColor={presentation.titleColor ?? 'text'}
        titleLines={presentation.titleLines}
        centered={presentation.centered ?? false}
      />
      {value ? (
        <AppText
          variant={isIos ? 'body' : 'subhead'}
          color={presentation.valueColor ?? 'textMuted'}
          align="right"
          style={styles.value}
        >
          {value}
        </AppText>
      ) : null}
      {trailing}
      {action?.chevron && isIos ? (
        <Icon name="chevron_right" size={CHEVRON_SIZE} color="textFaint" />
      ) : null}
    </>
  );
}

const useStyles = createThemedStyles(() => ({
  leading: {
    alignItems: 'center',
  },
  value: {
    flexShrink: 1,
    maxWidth: '55%',
  },
}));
