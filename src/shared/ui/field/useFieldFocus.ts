import { useCallback, useState } from 'react';

import { useRevealFocusedInput } from '../revealInput';

import type { BlurEvent, FocusEvent } from 'react-native';

export interface FieldFocusHandlers {
  readonly onFocus?: (event: FocusEvent) => void;
  readonly onBlur?: (event: BlurEvent) => void;
}

/**
 * Trạng thái "đang nhập" của một ô: đổi màu nhãn / gạch chân (Material) và cuộn ô lên trên
 * bàn phím khi được chọn. Vẫn gọi onFocus / onBlur của người dùng.
 */
export function useFieldFocus({ onFocus, onBlur }: FieldFocusHandlers = {}) {
  const reveal = useRevealFocusedInput();
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = useCallback(
    (event: FocusEvent) => {
      setIsFocused(true);
      reveal();
      onFocus?.(event);
    },
    [onFocus, reveal],
  );
  const handleBlur = useCallback(
    (event: BlurEvent) => {
      setIsFocused(false);
      onBlur?.(event);
    },
    [onBlur],
  );
  return { isFocused, handleFocus, handleBlur };
}
