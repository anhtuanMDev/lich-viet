import { useCallback, useMemo, useReducer, useState } from 'react';
import type { EventCalendar, EventRepeat, ReminderOffset } from '@core/events';
import { leapMonthAvailable } from '@shared/date-input';
import {
  initialFormState,
  switchCalendar,
  validateEventForm,
} from '../eventForm';
import type { EventFormState, InitialFormSource } from '../eventForm';

type TextField = 'title' | 'note' | 'day' | 'month' | 'year';

type Action =
  | {
      readonly type: 'setText';
      readonly field: TextField;
      readonly value: string;
    }
  | { readonly type: 'setLeap'; readonly value: boolean }
  | { readonly type: 'setRepeat'; readonly value: EventRepeat }
  | { readonly type: 'setReminder'; readonly value: ReminderOffset | null }
  | { readonly type: 'setCalendar'; readonly value: EventCalendar };

function reducer(state: EventFormState, action: Action): EventFormState {
  switch (action.type) {
    case 'setText':
      return { ...state, [action.field]: action.value };
    case 'setLeap':
      return { ...state, isLeapMonth: action.value };
    case 'setRepeat':
      return { ...state, repeat: action.value };
    case 'setReminder':
      return { ...state, remindDaysBefore: action.value };
    case 'setCalendar':
      return switchCalendar(state, action.value);
  }
}

export function useEventForm(source: InitialFormSource) {
  const [state, dispatch] = useReducer(reducer, source, initialFormState);
  // Chỉ hiện lỗi "thiếu tên" sau khi người dùng bấm Lưu, tránh báo đỏ ngay khi mở form.
  const [submitted, setSubmitted] = useState(false);

  const validation = useMemo(() => validateEventForm(state), [state]);
  const canChooseLeap =
    state.calendar === 'lunar' && leapMonthAvailable(state.month, state.year);

  const setText = useCallback(
    (field: TextField) => (value: string) =>
      dispatch({ type: 'setText', field, value }),
    [],
  );
  const handlers = useMemo(
    () => ({
      setTitle: setText('title'),
      setNote: setText('note'),
      setDay: setText('day'),
      setMonth: setText('month'),
      setYear: setText('year'),
      setLeap: (value: boolean) => dispatch({ type: 'setLeap', value }),
      setRepeat: (value: EventRepeat) => dispatch({ type: 'setRepeat', value }),
      setReminder: (value: ReminderOffset | null) =>
        dispatch({ type: 'setReminder', value }),
      setCalendar: (value: EventCalendar) =>
        dispatch({ type: 'setCalendar', value }),
    }),
    [setText],
  );

  return {
    state,
    validation,
    canChooseLeap,
    titleError:
      submitted && validation.status === 'invalid'
        ? validation.titleError
        : null,
    markSubmitted: useCallback(() => setSubmitted(true), []),
    ...handlers,
  };
}
