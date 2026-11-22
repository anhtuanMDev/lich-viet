import type { ColorTokens } from '@shared/theme';
import type { ReactNode } from 'react';

/** Hàng bấm được: việc khi bấm, gợi ý cho trình đọc màn hình, mũi tên ">" (chỉ iOS). */
export interface ListRowAction {
  readonly onPress: () => void;
  readonly hint?: string;
  readonly chevron?: boolean;
}

/** Cách hiển thị và cách đọc một hàng. */
export interface ListRowPresentation {
  readonly titleColor?: keyof ColorTokens;
  readonly valueColor?: keyof ColorTokens;
  /** Chữ căn giữa, kiểu nút trong danh sách (VD "Xoá sự kiện" trên iOS). */
  readonly centered?: boolean;
  readonly titleLines?: number;
  /** Bề rộng cột đầu hàng khi rộng hơn một icon (VD cột ngày). */
  readonly leadingWidth?: number;
  /** Câu đọc cho trình đọc màn hình thay cho chữ hiển thị. */
  readonly spokenLabel?: string;
}

export interface ListRowProps {
  readonly title: string;
  readonly subtitle?: string;
  /** Giá trị bên phải (chữ phụ). */
  readonly value?: string;
  /** Icon / ký hiệu đầu hàng. */
  readonly leading?: ReactNode;
  /** Phần tử tuỳ ý cuối hàng (công tắc, nút bước…). */
  readonly trailing?: ReactNode;
  readonly action?: ListRowAction;
  readonly presentation?: ListRowPresentation;
}
