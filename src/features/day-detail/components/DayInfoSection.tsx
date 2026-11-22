import { formatCanChi } from '@core/lunar';
import { ListRow, Section } from '@shared/ui';

import type { DayDetail } from '@core/lunar';

/**
 * Hoàng đạo / hắc đạo, tiết khí, can chi tháng và năm (chung một hàng cho gọn). Can chi ngày
 * nằm ở tiêu đề mục.
 */
export function DayInfoSection({ detail }: { readonly detail: DayDetail }) {
  const { quality, solarTerm, canChi } = detail;
  return (
    <Section title={`Ngày ${formatCanChi(canChi.day)}`}>
      <ListRow
        title={quality.isAuspicious ? 'Hoàng đạo' : 'Hắc đạo'}
        value={quality.deity}
        presentation={{
          valueColor: quality.isAuspicious ? 'auspicious' : 'textMuted',
        }}
      />
      <ListRow
        title="Tiết khí"
        value={
          solarTerm.startsToday ? `${solarTerm.name}, ngày đầu` : solarTerm.name
        }
        presentation={{
          valueColor: solarTerm.startsToday ? 'lunarAccent' : 'textMuted',
        }}
      />
      <ListRow
        title="Tháng, năm"
        value={`${formatCanChi(canChi.month)}, ${formatCanChi(canChi.year)}`}
      />
    </Section>
  );
}
