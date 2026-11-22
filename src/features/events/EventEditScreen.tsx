import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Alert, Platform, View } from 'react-native';

import { ensureNotificationPermission } from '@features/reminders/permission';
import { useSettings } from '@features/settings';
import { runInBackground } from '@shared/async/runInBackground';
import { DateInputRow, LeapMonthSwitch } from '@shared/date-input';
import { useToday } from '@shared/hooks/useToday';
import { createThemedStyles, useTheme } from '@shared/theme';
import {
  ActionRow,
  AppText,
  Button,
  FieldGroup,
  HeaderIconButton,
  Screen,
  Section,
  SegmentedControl,
  SwitchRow,
  TextField,
  formatTime,
} from '@shared/ui';

import { DatePreview } from './components/DatePreview';
import { TITLE_MAX_LENGTH } from './eventForm';
import { eventRepository } from './eventRepository';
import { useEventForm } from './hooks/useEventForm';

import type {
  RootStackParamList,
  RootStackScreenProps,
} from '@app/navigation/types';
import type { EventCalendar, EventRepeat, ReminderOffset } from '@core/events';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SegmentOption } from '@shared/ui';

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
        <FieldGroup>
          <AppText>Sự kiện này không còn tồn tại.</AppText>
          <Button label="Đóng" variant="tonal" onPress={close} />
        </FieldGroup>
      </Screen>
    );
  }
  // `key` để form khởi tạo lại nếu màn hình được dùng lại cho sự kiện khác.
  return (
    <EventForm
      key={eventId ?? 'new'}
      navigation={navigation}
      eventId={eventId}
      source={{ event, date: route.params?.date ?? today }}
      onDone={close}
    />
  );
}

/** Nút trên thanh tiêu đề Android: đóng (X) bên trái, "Lưu" bên phải. */
const renderAndroidClose = (onPress: () => void) =>
  function HeaderClose() {
    return <HeaderIconButton icon="close" label="Huỷ" onPress={onPress} />;
  };
const renderAndroidSave = (onPress: () => void) =>
  function HeaderSave() {
    return (
      <Button label="Lưu" variant="plain" size="small" onPress={onPress} />
    );
  };

interface EventFormProps {
  readonly navigation: NativeStackNavigationProp<
    RootStackParamList,
    'EventEdit'
  >;
  readonly eventId: string | undefined;
  readonly source: Parameters<typeof useEventForm>[0];
  readonly onDone: () => void;
}

function EventForm({ navigation, eventId, source, onDone }: EventFormProps) {
  const styles = useStyles();
  const theme = useTheme();
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

  // Huỷ / Lưu trên thanh tiêu đề như form native: iOS nút chữ, Android nút đóng (X) + "Lưu".
  useLayoutEffect(() => {
    navigation.setOptions(
      Platform.OS === 'ios'
        ? {
            unstable_headerLeftItems: () => [
              { type: 'button', label: 'Huỷ', onPress: onDone },
            ],
            unstable_headerRightItems: () => [
              {
                type: 'button',
                label: 'Lưu',
                variant: 'prominent',
                tintColor: theme.colors.primary,
                onPress: save,
              },
            ],
          }
        : {
            headerLeft: renderAndroidClose(onDone),
            headerRight: renderAndroidSave(save),
          },
    );
  }, [navigation, onDone, save, theme.colors.primary]);

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <FieldGroup>
        <TextField
          label="Tên sự kiện"
          value={state.title}
          onChangeText={form.setTitle}
          placeholder="VD: Giỗ ông nội"
          maxLength={TITLE_MAX_LENGTH}
          returnKeyType="done"
          error={form.titleError}
        />
      </FieldGroup>

      <Section title="Ngày" separators={false}>
        <FieldGroup>
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
              validation.date.status === 'invalid'
                ? validation.date.field
                : null
            }
            onChangeDay={form.setDay}
            onChangeMonth={form.setMonth}
            onChangeYear={form.setYear}
          />
        </FieldGroup>
        {form.canChooseLeap ? (
          <LeapMonthSwitch
            month={state.month}
            value={state.isLeapMonth}
            onChange={form.setLeap}
          />
        ) : null}
        <FieldGroup>
          <DatePreview calendar={state.calendar} result={validation.date} />
        </FieldGroup>
      </Section>

      <Section
        title="Lặp lại"
        separators={false}
        footer={
          state.repeat === 'yearly' && state.calendar === 'lunar'
            ? 'Ngày ở tháng nhuận được tính theo tháng thường các năm sau; ngày 30 gặp tháng thiếu tính vào ngày 29.'
            : undefined
        }
      >
        <FieldGroup>
          <SegmentedControl
            options={REPEAT_OPTIONS}
            value={state.repeat}
            onChange={form.setRepeat}
          />
        </FieldGroup>
      </Section>

      <Section
        title="Nhắc lịch"
        separators={false}
        footer={
          state.remindDaysBefore !== null
            ? reminderHint(state.remindDaysBefore, reminderTime)
            : undefined
        }
      >
        <SwitchRow
          label="Gửi thông báo nhắc"
          value={state.remindDaysBefore !== null}
          onChange={toggleReminder}
        />
        {state.remindDaysBefore !== null ? (
          <FieldGroup>
            <SegmentedControl
              options={REMINDER_OPTIONS}
              value={String(state.remindDaysBefore) as ReminderOption}
              onChange={changeReminder}
            />
          </FieldGroup>
        ) : null}
      </Section>

      <Section separators={false}>
        <FieldGroup>
          <TextField
            label="Ghi chú"
            value={state.note}
            onChangeText={form.setNote}
            placeholder="Không bắt buộc"
            multiline
          />
        </FieldGroup>
      </Section>

      {eventId !== undefined ? (
        // Tách xa các ô nhập để không bấm nhầm.
        <View style={styles.danger}>
          <ActionRow
            label="Xoá sự kiện"
            tone="danger"
            onPress={confirmDelete}
          />
        </View>
      ) : null}
    </Screen>
  );
}

const useStyles = createThemedStyles(t => ({
  danger: {
    marginTop: t.spacing.xxl,
  },
}));
