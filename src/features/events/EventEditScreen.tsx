import { useCallback, useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import type { RootStackScreenProps } from '@app/navigation/types';
import type { EventCalendar, EventRepeat, ReminderOffset } from '@core/events';
import { ensureNotificationPermission } from '@features/reminders/permission';
import { useSettings } from '@features/settings';
import { DateInputRow, LeapMonthSwitch } from '@shared/date-input';
import { useToday } from '@shared/hooks/useToday';
import { createThemedStyles } from '@shared/theme';
import {
  AppText,
  Button,
  Card,
  Screen,
  SegmentedControl,
  SwitchRow,
  TextField,
  formatTime,
} from '@shared/ui';
import type { SegmentOption } from '@shared/ui';
import { DatePreview } from './components/DatePreview';
import { TITLE_MAX_LENGTH } from './eventForm';
import { eventRepository } from './eventRepository';
import { useEventForm } from './hooks/useEventForm';
import { runInBackground } from '@shared/async/runInBackground';

const CALENDAR_OPTIONS: readonly SegmentOption<EventCalendar>[] = [
  { value: 'lunar', label: 'Âm lịch' },
  { value: 'solar', label: 'Dương lịch' },
];

// Bật/tắt nhắc tách ra công tắc riêng; SegmentedControl chỉ còn 4 lựa chọn thời điểm
// (5 lựa chọn trên một hàng bị vỡ chữ trên điện thoại hẹp). Quy đổi chuỗi ↔ ReminderOffset ở đây.
type ReminderOption = '0' | '1' | '3' | '7';
const REMINDER_OPTIONS: readonly SegmentOption<ReminderOption>[] = [
  { value: '0', label: 'Đúng ngày' },
  { value: '1', label: '1 ngày' },
  { value: '3', label: '3 ngày' },
  { value: '7', label: '7 ngày' },
];
/** Lựa chọn khi bật nhắc lần đầu. */
const DEFAULT_REMINDER: ReminderOffset = 1;

const reminderHint = (offset: ReminderOffset, time: string): string =>
  offset === 0
    ? `Thông báo lúc ${time} vào đúng ngày.`
    : `Thông báo lúc ${time}, trước ${offset} ngày.`;

const REPEAT_OPTIONS: readonly SegmentOption<EventRepeat>[] = [
  { value: 'yearly', label: 'Hằng năm' },
  { value: 'once', label: 'Một lần' },
];

export function EventEditScreen({
  navigation,
  route,
}: RootStackScreenProps<'EventEdit'>) {
  const eventId = route.params?.eventId;
  // Chụp lại lúc mở màn hình: form chỉ dùng giá trị ban đầu, và sau khi xoá tại đây
  // màn hình vẫn giữ nguyên nội dung trong lúc animation đóng chạy.
  const [event] = useState(() =>
    eventId === undefined ? undefined : eventRepository.get(eventId),
  );
  const today = useToday();
  const close = useCallback(() => navigation.goBack(), [navigation]);

  // Id không hợp lệ (VD link cũ tới sự kiện đã xoá).
  if (eventId !== undefined && event === undefined) {
    return (
      <Screen edges={['left', 'right', 'bottom']}>
        <Card>
          <AppText>Sự kiện này không còn tồn tại.</AppText>
        </Card>
        <Button label="Đóng" variant="secondary" onPress={close} />
      </Screen>
    );
  }
  // `key` để form khởi tạo lại nếu màn hình được dùng lại cho sự kiện khác.
  return (
    <EventForm
      key={eventId ?? 'new'}
      eventId={eventId}
      source={{ event, date: route.params?.date ?? today }}
      onDone={close}
    />
  );
}

interface EventFormProps {
  readonly eventId: string | undefined;
  readonly source: Parameters<typeof useEventForm>[0];
  readonly onDone: () => void;
}

function EventForm({ eventId, source, onDone }: EventFormProps) {
  const styles = useStyles();
  const form = useEventForm(source);
  const { state, validation, markSubmitted, setReminder } = form;

  const reminderTime = formatTime(useSettings().reminders.time);
  // Tắt rồi bật lại thì giữ lựa chọn cũ.
  const lastReminder = useRef<ReminderOffset>(
    state.remindDaysBefore ?? DEFAULT_REMINDER,
  );
  const toggleReminder = useCallback(
    (on: boolean) => setReminder(on ? lastReminder.current : null),
    [setReminder],
  );
  const changeReminder = useCallback(
    (option: ReminderOption) => {
      lastReminder.current = Number(option) as ReminderOffset;
      setReminder(lastReminder.current);
    },
    [setReminder],
  );

  const save = useCallback(() => {
    markSubmitted();
    if (validation.status !== 'ok') {
      return;
    }
    if (eventId === undefined) {
      eventRepository.create(validation.draft);
    } else {
      eventRepository.update(eventId, validation.draft);
    }
    onDone();
    // Lưu trước rồi mới xin quyền: từ chối quyền không làm mất sự kiện.
    if (validation.draft.remindDaysBefore !== null) {
      runInBackground(ensureNotificationPermission(), 'events');
    }
  }, [eventId, markSubmitted, onDone, validation]);

  const confirmDelete = useCallback(() => {
    if (eventId === undefined) {
      return;
    }
    Alert.alert('Xoá sự kiện?', `"${state.title}" sẽ bị xoá khỏi máy.`, [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: () => {
          eventRepository.remove(eventId);
          onDone();
        },
      },
    ]);
  }, [eventId, onDone, state.title]);

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Card>
        <TextField
          label="Tên sự kiện"
          value={state.title}
          onChangeText={form.setTitle}
          placeholder="VD: Giỗ ông nội"
          maxLength={TITLE_MAX_LENGTH}
          returnKeyType="done"
          error={form.titleError}
        />
      </Card>

      <Card title="Ngày">
        <SegmentedControl
          options={CALENDAR_OPTIONS}
          value={state.calendar}
          onChange={form.setCalendar}
        />
        <DateInputRow
          day={state.day}
          month={state.month}
          year={state.year}
          invalidField={
            validation.date.status === 'invalid' ? validation.date.field : null
          }
          onChangeDay={form.setDay}
          onChangeMonth={form.setMonth}
          onChangeYear={form.setYear}
        />
        {form.canChooseLeap ? (
          <LeapMonthSwitch
            month={state.month}
            value={state.isLeapMonth}
            onChange={form.setLeap}
          />
        ) : null}
        <DatePreview calendar={state.calendar} result={validation.date} />
      </Card>

      <Card title="Lặp lại">
        <SegmentedControl
          options={REPEAT_OPTIONS}
          value={state.repeat}
          onChange={form.setRepeat}
        />
        {state.repeat === 'yearly' && state.calendar === 'lunar' ? (
          <AppText variant="label" color="textMuted">
            Ngày ở tháng nhuận sẽ được tính theo tháng thường các năm sau; ngày
            30 gặp tháng thiếu sẽ tính vào ngày 29.
          </AppText>
        ) : null}
      </Card>

      <Card title="Nhắc lịch">
        <SwitchRow
          label="Gửi thông báo nhắc"
          value={state.remindDaysBefore !== null}
          onChange={toggleReminder}
        />
        {state.remindDaysBefore !== null ? (
          <>
            <SegmentedControl
              options={REMINDER_OPTIONS}
              value={String(state.remindDaysBefore) as ReminderOption}
              onChange={changeReminder}
            />
            <AppText variant="label" color="textMuted">
              {reminderHint(state.remindDaysBefore, reminderTime)}
            </AppText>
          </>
        ) : null}
      </Card>

      <Card>
        <TextField
          label="Ghi chú"
          value={state.note}
          onChangeText={form.setNote}
          placeholder="Không bắt buộc"
          multiline
        />
      </Card>

      <View style={styles.actions}>
        <Button label="Lưu" onPress={save} />
        {eventId !== undefined ? (
          <Button
            label="Xoá sự kiện"
            variant="danger"
            onPress={confirmDelete}
          />
        ) : null}
      </View>
    </Screen>
  );
}

const useStyles = createThemedStyles(t => ({
  actions: {
    gap: t.spacing.sm,
    marginTop: t.spacing.sm,
  },
}));
