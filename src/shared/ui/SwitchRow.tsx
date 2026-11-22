import { ListRow } from './list/ListRow';
import { Toggle } from './Toggle';

export interface SwitchRowProps {
  readonly label: string;
  readonly subtitle?: string;
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
  readonly accessibilityLabel?: string;
}

/** Hàng danh sách có công tắc ở cuối. */
export function SwitchRow({
  label,
  subtitle,
  value,
  onChange,
  accessibilityLabel,
}: SwitchRowProps) {
  return (
    <ListRow
      title={label}
      subtitle={subtitle}
      trailing={
        <Toggle
          value={value}
          onChange={onChange}
          accessibilityLabel={accessibilityLabel ?? label}
        />
      }
    />
  );
}
