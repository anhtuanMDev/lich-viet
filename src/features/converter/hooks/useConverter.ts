import { useCallback, useMemo, useReducer } from 'react';
import type { SolarDate } from '@core/lunar';
import { convert, leapMonthAvailable } from '@shared/date-input';
import type { ConversionDirection, ConverterInput } from '@shared/date-input';

type Field = 'day' | 'month' | 'year';

type Action =
  | { readonly type: 'setField'; readonly field: Field; readonly value: string }
  | { readonly type: 'setLeap'; readonly value: boolean }
  | {
      readonly type: 'swap';
      readonly direction: ConversionDirection;
      readonly carry: InputDate | null;
    };

interface InputDate {
  readonly day: number;
  readonly month: number;
  readonly year: number;
  readonly isLeapMonth: boolean;
}

function reducer(state: ConverterInput, action: Action): ConverterInput {
  switch (action.type) {
    case 'setField':
      return { ...state, [action.field]: action.value };
    case 'setLeap':
      return { ...state, isLeapMonth: action.value };
    case 'swap':
      if (action.direction === state.direction) {
        return state;
      }
      // Đổi chiều: mang kết quả hiện tại sang làm dữ liệu nhập để người dùng thấy ngay ngày tương ứng.
      return action.carry
        ? {
            direction: action.direction,
            day: String(action.carry.day),
            month: String(action.carry.month),
            year: String(action.carry.year),
            isLeapMonth: action.carry.isLeapMonth,
          }
        : { ...state, direction: action.direction, isLeapMonth: false };
  }
}

export function useConverter(initial: SolarDate) {
  const [input, dispatch] = useReducer(reducer, initial, date => ({
    direction: 'solarToLunar' as const,
    day: String(date.day),
    month: String(date.month),
    year: String(date.year),
    isLeapMonth: false,
  }));

  const result = useMemo(() => convert(input), [input]);
  const canChooseLeap =
    input.direction === 'lunarToSolar' &&
    leapMonthAvailable(input.month, input.year);

  const setDay = useCallback(
    (value: string) => dispatch({ type: 'setField', field: 'day', value }),
    [],
  );
  const setMonth = useCallback(
    (value: string) => dispatch({ type: 'setField', field: 'month', value }),
    [],
  );
  const setYear = useCallback(
    (value: string) => dispatch({ type: 'setField', field: 'year', value }),
    [],
  );
  const setLeap = useCallback(
    (value: boolean) => dispatch({ type: 'setLeap', value }),
    [],
  );

  const setDirection = useCallback(
    (direction: ConversionDirection) => {
      let carry: InputDate | null = null;
      if (result.status === 'ok') {
        carry =
          direction === 'lunarToSolar'
            ? result.lunar
            : { ...result.solar, isLeapMonth: false };
      }
      dispatch({ type: 'swap', direction, carry });
    },
    [result],
  );

  return {
    input,
    result,
    canChooseLeap,
    setDay,
    setMonth,
    setYear,
    setLeap,
    setDirection,
  };
}
