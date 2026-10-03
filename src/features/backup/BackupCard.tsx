import { useCallback } from 'react';
import { Alert, Platform, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { serializeBackup } from '@core/events';
import { eventRepository } from '@features/events/eventRepository';
import { AppText, Button, Card } from '@shared/ui';

const AUTO_BACKUP_NOTE = Platform.select({
  ios: 'Dữ liệu được sao lưu tự động cùng bản sao lưu iCloud của iPhone. Khi khôi phục máy mới từ bản sao lưu, sự kiện và ngày giỗ sẽ trở lại.',
  default:
    'Dữ liệu được sao lưu tự động lên Google (Cài đặt máy → Google → Sao lưu). Khi cài lại app hoặc đổi máy cùng tài khoản Google, sự kiện và ngày giỗ sẽ trở lại.',
});

/** Sao lưu: thông tin sao lưu tự động + xuất/nhập thủ công. */
export function BackupCard() {
  const navigation = useNavigation();

  const exportData = useCallback(async () => {
    const events = eventRepository.list();
    if (events.length === 0) {
      Alert.alert('Chưa có dữ liệu', 'Bạn chưa lưu sự kiện nào để xuất.');
      return;
    }
    try {
      await Share.share({
        title: 'Sao lưu Lịch Việt',
        message: serializeBackup(events),
      });
    } catch (error) {
      console.warn('[backup] Không chia sẻ được', error);
      Alert.alert('Không xuất được dữ liệu', 'Vui lòng thử lại.');
    }
  }, []);

  const openImport = useCallback(
    () => navigation.navigate('ImportBackup'),
    [navigation],
  );

  return (
    <Card title="Sao lưu dữ liệu">
      <AppText color="textMuted">{AUTO_BACKUP_NOTE}</AppText>
      <AppText color="textMuted">
        Bạn cũng có thể tự xuất dữ liệu (gửi qua Zalo, email, ghi chú…) rồi nhập
        lại trên máy khác.
      </AppText>
      <Button label="Xuất dữ liệu" variant="secondary" onPress={exportData} />
      <Button label="Nhập dữ liệu" variant="secondary" onPress={openImport} />
    </Card>
  );
}
