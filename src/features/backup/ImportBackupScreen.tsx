import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { parseBackup } from '@core/events';
import type { RootStackScreenProps } from '@app/navigation/types';
import { eventRepository } from '@features/events/eventRepository';
import { AppText, Button, Card, Screen, TextField } from '@shared/ui';

function describeResult(
  added: number,
  updated: number,
  unchanged: number,
  dropped: number,
): string {
  const parts = [`Thêm mới ${added} sự kiện`, `cập nhật ${updated}`];
  if (unchanged > 0) {
    parts.push(`${unchanged} sự kiện đã có sẵn`);
  }
  if (dropped > 0) {
    parts.push(`bỏ qua ${dropped} mục bị lỗi`);
  }
  return `${parts.join(', ')}.`;
}

/** Dán nội dung đã xuất để nhập lại. Gộp với dữ liệu hiện có, không xoá gì. */
export function ImportBackupScreen({
  navigation,
}: RootStackScreenProps<'ImportBackup'>) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const importData = useCallback(() => {
    const parsed = parseBackup(text);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    const result = eventRepository.importEvents(parsed.events);
    Alert.alert(
      'Đã nhập dữ liệu',
      describeResult(
        result.added,
        result.updated,
        result.unchanged,
        parsed.dropped,
      ),
      [{ text: 'Xong', onPress: () => navigation.goBack() }],
    );
  }, [navigation, text]);

  const changeText = useCallback((value: string) => {
    setText(value);
    setError(null);
  }, []);

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Card>
        <AppText color="textMuted">
          Dán toàn bộ nội dung đã xuất từ Lịch Việt vào ô dưới đây. Sự kiện được
          gộp với dữ liệu hiện có - không sự kiện nào bị xoá.
        </AppText>
        <TextField
          label="Nội dung sao lưu"
          value={text}
          onChangeText={changeText}
          placeholder='{"app":"lich-viet", …}'
          multiline
          autoCorrect={false}
          autoCapitalize="none"
          error={error}
        />
      </Card>
      <Button
        label="Nhập dữ liệu"
        onPress={importData}
        disabled={text.trim().length === 0}
      />
    </Screen>
  );
}
