import { View } from 'react-native';

import { createThemedStyles } from '@shared/theme';
import { AppText, Button } from '@shared/ui';

/** Danh sách sự kiện trống: giải thích app làm gì và mời thêm sự kiện đầu tiên. */
export function EventsEmptyState({ onAdd }: { readonly onAdd: () => void }) {
  const styles = useStyles();
  return (
    <View style={styles.empty}>
      <AppText variant="title" align="center">
        Chưa có sự kiện nào
      </AppText>
      <AppText color="textMuted" align="center">
        Lưu ngày giỗ, sinh nhật âm lịch hay các dịp quan trọng. Mỗi năm app tự
        tính ra ngày dương lịch tương ứng và nhắc bạn.
      </AppText>
      <Button label="Thêm sự kiện" onPress={onAdd} />
    </View>
  );
}

const useStyles = createThemedStyles(theme => ({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.xxl,
    paddingBottom: 64,
  },
}));
