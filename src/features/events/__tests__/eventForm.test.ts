import type { CalendarEvent } from '@core/events';
import {
  initialFormState,
  switchCalendar,
  validateEventForm,
} from '../eventForm';
import type { EventFormState } from '../eventForm';

const TET_2024 = { year: 2024, month: 2, day: 10 } as const;

describe('initialFormState', () => {
  it('mặc định âm lịch, lặp hằng năm, điền sẵn ngày âm của ngày được chọn', () => {
    expect(initialFormState({ date: TET_2024 })).toMatchObject({
      calendar: 'lunar',
      repeat: 'yearly',
      remindDaysBefore: 1,
      day: '1',
      month: '1',
      year: '2024',
      isLeapMonth: false,
    });
  });

  it('điền từ sự kiện có sẵn', () => {
    const event: CalendarEvent = {
      id: 'x',
      title: 'Giỗ',
      note: 'Mua hoa',
      origin: {
        calendar: 'lunar',
        date: { year: 2023, month: 2, day: 2, isLeapMonth: true },
      },
      repeat: 'yearly',
      remindDaysBefore: null,
      createdAt: 0,
      updatedAt: 0,
    };
    expect(initialFormState({ event, date: TET_2024 })).toMatchObject({
      title: 'Giỗ',
      note: 'Mua hoa',
      month: '2',
      isLeapMonth: true,
    });
  });
});

describe('switchCalendar', () => {
  it('giữ nguyên ngày thực khi đổi âm ⇄ dương', () => {
    const lunar = initialFormState({ date: TET_2024 });
    const solar = switchCalendar(lunar, 'solar');
    expect(solar).toMatchObject({
      calendar: 'solar',
      day: '10',
      month: '2',
      year: '2024',
    });
    expect(switchCalendar(solar, 'lunar')).toMatchObject({
      day: '1',
      month: '1',
    });
  });
});

describe('validateEventForm', () => {
  const base: EventFormState = {
    ...initialFormState({ date: TET_2024 }),
    title: '  Tết  ',
  };

  it('tạo bản nháp hợp lệ, đã cắt khoảng trắng', () => {
    const result = validateEventForm(base);
    expect(result.status).toBe('ok');
    expect(result.status === 'ok' && result.draft).toMatchObject({
      title: 'Tết',
      origin: {
        calendar: 'lunar',
        date: { year: 2024, month: 1, day: 1, isLeapMonth: false },
      },
    });
  });

  it('báo lỗi khi thiếu tên hoặc ngày không tồn tại', () => {
    const result = validateEventForm({ ...base, title: ' ', day: '31' });
    expect(result).toMatchObject({
      status: 'invalid',
      titleError: 'Nhập tên sự kiện',
      date: { status: 'invalid', field: 'day' },
    });
  });
});
