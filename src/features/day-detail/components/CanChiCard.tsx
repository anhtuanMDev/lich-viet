import { formatCanChi } from '@core/lunar';
import type { DayDetail } from '@core/lunar';
import { Card, InfoRow } from '@shared/ui';

export function CanChiCard({
  canChi,
}: {
  readonly canChi: DayDetail['canChi'];
}) {
  return (
    <Card title="Can chi">
      <InfoRow label="Ngày" value={formatCanChi(canChi.day)} />
      <InfoRow label="Tháng" value={formatCanChi(canChi.month)} />
      <InfoRow label="Năm" value={formatCanChi(canChi.year)} />
    </Card>
  );
}
