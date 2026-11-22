import { SwitchRow } from '@shared/ui';

export interface LeapMonthSwitchProps {
  readonly month: string;
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
}

/** Hàng công tắc "Tháng N nhuận" - chỉ hiện khi năm đó có tháng N nhuận. */
export function LeapMonthSwitch({
  month,
  value,
  onChange,
}: LeapMonthSwitchProps) {
  return (
    <SwitchRow
      label={`Tháng ${month} nhuận`}
      value={value}
      onChange={onChange}
      accessibilityLabel={`Chọn tháng ${month} nhuận`}
    />
  );
}
