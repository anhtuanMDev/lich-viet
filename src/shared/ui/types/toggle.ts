export interface ToggleProps {
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
  readonly accessibilityLabel: string;
}
