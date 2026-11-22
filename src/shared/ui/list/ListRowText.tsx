import { View } from 'react-native';

import { createThemedStyles } from '@shared/theme';

import { AppText } from '../AppText';

import { isIos } from './metrics';

import type { ColorTokens } from '@shared/theme';

export interface ListRowTextProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly titleColor: keyof ColorTokens;
  readonly titleLines?: number;
  readonly centered: boolean;
}

/** Tên hàng và dòng phụ bên dưới. */
export function ListRowText({
  title,
  subtitle,
  titleColor,
  titleLines,
  centered,
}: ListRowTextProps) {
  const styles = useStyles();
  return (
    <View style={[styles.text, centered && styles.centered]}>
      <AppText
        color={titleColor}
        numberOfLines={titleLines}
        align={centered ? 'center' : undefined}
      >
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant={isIos ? 'footnote' : 'subhead'} color="textMuted">
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const useStyles = createThemedStyles(() => ({
  text: {
    flex: 1,
    gap: isIos ? 1 : 0,
  },
  centered: {
    alignItems: 'center',
  },
}));
