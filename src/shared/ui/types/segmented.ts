export interface SegmentOption<T extends string> {
  readonly value: T;
  readonly label: string;
  /** Câu đọc cho trình đọc màn hình khi nhãn hiển thị viết tắt (xem core/a11y). */
  readonly spokenLabel?: string;
}
