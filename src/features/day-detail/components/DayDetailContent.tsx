import { memo } from 'react';
import type { DayDetail } from '@core/lunar';
import { DayEventsCard } from '@features/events';
import { AuspiciousHoursCard } from './AuspiciousHoursCard';
import { CanChiCard } from './CanChiCard';
import { DayHero } from './DayHero';
import { DayQualityCard } from './DayQualityCard';

export const DayDetailContent = memo(function DayDetailContentView({
  detail,
}: {
  readonly detail: DayDetail;
}) {
  return (
    <>
      <DayHero detail={detail} />
      <DayEventsCard jd={detail.jd} />
      <DayQualityCard quality={detail.quality} solarTerm={detail.solarTerm} />
      <CanChiCard canChi={detail.canChi} />
      <AuspiciousHoursCard hours={detail.auspiciousHours} />
    </>
  );
});
