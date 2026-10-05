import { createContext, useContext } from 'react';

/** Do `Screen` cung cấp: cuộn ô đang nhập lên trên bàn phím. */
export const RevealInputContext = createContext<() => void>(() => {});

/** Gọi trong `onFocus` của ô nhập để ô luôn nằm trên bàn phím khi chuyển ô. */
export const useRevealFocusedInput = (): (() => void) =>
  useContext(RevealInputContext);
