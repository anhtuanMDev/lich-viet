import { solarToLunar } from '@core/lunar';
import type { SolarDate } from '@core/lunar';
import type {
  CalendarEvent,
  EventCalendar,
  EventDate,
  EventRepeat,
  ReminderOffset,
} from '@core/events';
import { convert } from '@shared/date-input';
import type { ConversionResult } from '@shared/date-input';
import type { EventDraft } from './eventRepository';

export interface EventFormState {
  readonly title: string;
  readonly note: string;
  readonly calendar: EventCalendar;
  readonly day: string;
  readonly month: string;
  readonly year: string;
  readonly isLeapMonth: boolean;
  readonly repeat: EventRepeat;
  readonly remindDaysBefore: ReminderOffset | null;
}

export const TITLE_MAX_LENGTH = 80;

/** Sự kiện mới mặc định nhắc trước 1 ngày – đủ thời gian chuẩn bị cho ngày giỗ. */
export const DEFAULT_REMINDER: ReminderOffset = 1;

export interface InitialFormSource {
  readonly event?: CalendarEvent;
  /** Ngày dương được chọn sẵn (VD bấm "Thêm sự kiện" từ một ngày trong lịch). */
  readonly date: SolarDate;
}

function dateFields(origin: EventDate) {
  const { date } = origin;
  return {
    calendar: origin.calendar,
    day: String(date.day),
    month: String(date.month),
    year: String(date.year),
    isLeapMonth: origin.calendar === 'lunar' && origin.date.isLeapMonth,
  };
}

export function initialFormState({
  event,
  date,
}: InitialFormSource): EventFormState {
  if (event) {
    return {
      title: event.title,
      note: event.note,
      repeat: event.repeat,
      remindDaysBefore: event.remindDaysBefore,
      ...dateFields(event.origin),
    };
  }
  // Mặc định âm lịch + lặp hằng năm: trường hợp phổ biến nhất là ngày giỗ.
  return {
    title: '',
    note: '',
    repeat: 'yearly',
    remindDaysBefore: DEFAULT_REMINDER,
    ...dateFields({ calendar: 'lunar', date: solarToLunar(date) }),
  };
}

export const resolveFormDate = (state: EventFormState): ConversionResult =>
  convert({
    direction: state.calendar === 'solar' ? 'solarToLunar' : 'lunarToSolar',
    day: state.day,
    month: state.month,
    year: state.year,
    isLeapMonth: state.isLeapMonth,
  });

/** Đổi loại lịch nhưng giữ nguyên ngày thực: 18/4/2024 dương ⇄ 10/3/2024 âm. */
export function switchCalendar(
  state: EventFormState,
  calendar: EventCalendar,
): EventFormState {
  if (calendar === state.calendar) {
    return state;
  }
  const resolved = resolveFormDate(state);
  if (resolved.status !== 'ok') {
    return { ...state, calendar, isLeapMonth: false };
  }
  return {
    ...state,
    ...dateFields(
      calendar === 'solar'
        ? { calendar, date: resolved.solar }
        : { calendar, date: resolved.lunar },
    ),
  };
}

export type EventFormValidation =
  | {
      readonly status: 'ok';
      readonly draft: EventDraft;
      readonly date: ConversionResult;
    }
  | {
      readonly status: 'invalid';
      readonly titleError: string | null;
      readonly date: ConversionResult;
    };

export function validateEventForm(state: EventFormState): EventFormValidation {
  const title = state.title.trim();
  const titleError = title.length === 0 ? 'Nhập tên sự kiện' : null;
  const date = resolveFormDate(state);

  if (titleError !== null || date.status !== 'ok') {
    return { status: 'invalid', titleError, date };
  }
  const origin: EventDate =
    state.calendar === 'solar'
      ? { calendar: 'solar', date: date.solar }
      : { calendar: 'lunar', date: date.lunar };

  return {
    status: 'ok',
    date,
    draft: {
      title,
      note: state.note.trim(),
      origin,
      repeat: state.repeat,
      remindDaysBefore: state.remindDaysBefore,
    },
  };
}
