import type { DayQuality, SolarTermInfo } from '@core/lunar';
import { Card, InfoRow } from '@shared/ui';

export interface DayQualityCardProps {
  readonly quality: DayQuality;
  readonly solarTerm: SolarTermInfo;
}

export function DayQualityCard({ quality, solarTerm }: DayQualityCardProps) {
  return (
    <Card title="Ngày">
      <InfoRow
        label={quality.isAuspicious ? 'Hoàng đạo' : 'Hắc đạo'}
        value={quality.deity}
        valueColor={quality.isAuspicious ? 'auspicious' : 'inauspicious'}
      />
      <InfoRow
        label="Tiết khí"
        value={
          solarTerm.startsToday ? `Bắt đầu ${solarTerm.name}` : solarTerm.name
        }
        valueColor={solarTerm.startsToday ? 'lunarAccent' : 'text'}
      />
    </Card>
  );
}
