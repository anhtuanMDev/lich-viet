import { PixelRatio } from 'react-native';
import { FlexWidget, SvgWidget, TextWidget } from 'react-native-android-widget';
import type { HexColor, WidgetInfo } from 'react-native-android-widget';
import { lunarDayTitle, lunarMonthName } from '@core/date/format';
import { parseIsoDate } from '@core/date/parse';
import { jdToLunar, moonPhaseOf, toJulianDay } from '@core/lunar';
import type { UpcomingKind } from '@core/events';
import type { LunarDate, MoonPhase, SolarDate } from '@core/lunar';
import type { WidgetDay, WidgetHighlight, WidgetUpcoming } from '@core/widget';
import { darkColors, lightColors } from '@shared/theme/tokens';
import type { ColorTokens } from '@shared/theme/tokens';
import { moonLitPath } from '@shared/ui/moonPath';
import { shortDaysAway } from '@features/events/formatEvent';

/*
 * Widget Android được vẽ từ JSX nhưng KHÔNG phải React Native view: chỉ dùng được
 * FlexWidget/TextWidget/SvgWidget với style giới hạn, không có hook, không có theme context.
 */

export const TODAY_WIDGET_NAME = 'Today';

/** Rộng hơn mức này (dp) thì thêm cột "Sắp tới". */
const WIDE_MIN_WIDTH = 250;
const PADDING = 16;
const COLUMN_GAP = 16;
const MOON_SIZE = 32;
/** Bo góc nền như widget hệ thống Android 12+. */
const RADIUS = 24;
/** Chiều cao một dòng (dp) ở cỡ chữ mặc định - để bỏ bớt dòng khi widget thấp. */
const LINE = { title: 22, solar: 20, highlight: 18 } as const;

type WidgetPalette = Record<
  | 'background'
  | 'text'
  | 'textMuted'
  | 'primary'
  | 'lunarAccent'
  | 'moonLit'
  | 'moonShade'
  | 'event',
  HexColor
>;

/** Vai màu Material 3 (đỏ son) của app - cùng nguồn src/shared/theme/tokens.ts. */
const toPalette = (colors: ColorTokens): WidgetPalette => ({
  background: colors.background as HexColor,
  text: colors.text as HexColor,
  textMuted: colors.textMuted as HexColor,
  primary: colors.primary as HexColor,
  lunarAccent: colors.lunarAccent as HexColor,
  moonLit: colors.moonLit as HexColor,
  moonShade: colors.moonShade as HexColor,
  event: colors.event as HexColor,
});

const LIGHT = toPalette(lightColors);
const DARK = toPalette(darkColors);

export type WidgetSize = Pick<WidgetInfo, 'width' | 'height'>;

const NBSP = ' ';
const keepTogether = (text: string): string => text.replace(/ /g, NBSP);

/**
 * "Mùng 3 tháng Mười", "Rằm tháng Giêng" như trong app; nếu phải xuống dòng thì chỉ ngắt
 * giữa ngày và tháng.
 */
function lunarTitle(lunar: LunarDate): string {
  const title = lunarDayTitle(lunar);
  const month = lunarMonthName(lunar.month, lunar.isLeapMonth);
  if (!title.endsWith(month)) {
    return title;
  }
  const dayPart = title.slice(0, -month.length).trimEnd();
  return `${keepTogether(dayPart)} ${keepTogether(month)}`;
}

/** Số ngày còn lại, đọc từ chuỗi snapshot ("Ngày mai", "Còn 7 ngày"). */
function daysAway({ when }: WidgetUpcoming): number | null {
  if (when === 'Ngày mai') {
    return 1;
  }
  const digits = when.replace(/\D/g, '');
  return digits ? Number(digits) : null;
}

/** Gọn như danh sách "Sắp tới" trong app: "Mai", "7 ngày". */
function shortWhen(item: WidgetUpcoming): string {
  const days = daysAway(item);
  return days === null ? item.when : shortDaysAway(days);
}

/** Đĩa trăng đúng pha - cùng hình học với Moon trong app (src/shared/ui/moon/Moon.tsx). */
function moonSvg(
  phase: MoonPhase | null,
  palette: WidgetPalette,
  size: number,
): string {
  const r = size / 2;
  const lit = phase ? moonLitPath(phase, r) : null;
  const disc = lit?.fill === 'full' ? palette.moonLit : palette.moonShade;
  const litPath =
    lit?.fill === 'partial'
      ? `<path d="${lit.path}" fill="${palette.moonLit}"/>`
      : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" ` +
    `viewBox="${-r} ${-r} ${size} ${size}"><circle r="${r}" fill="${disc}"/>${litPath}</svg>`
  );
}

/** Những gì widget cần, tính từ ngày YYYY-MM-DD của snapshot. */
interface DayView {
  readonly day: WidgetDay;
  readonly solar: SolarDate | null;
  readonly lunar: LunarDate | null;
  readonly phase: MoonPhase | null;
}

function toDayView(day: WidgetDay): DayView {
  const solar = parseIsoDate(day.date);
  const jd = solar ? toJulianDay(solar) : null;
  return {
    day,
    solar,
    lunar: jd === null ? null : jdToLunar(jd),
    phase: jd === null ? null : moonPhaseOf(jd),
  };
}

/** "12 tháng Mười âm lịch. Thứ sáu, ngày 20 tháng 11. Nhà giáo Việt Nam" */
function spokenSummary({ day, solar, lunar }: DayView): string {
  return [
    `${lunar ? lunarDayTitle(lunar) : day.lunar} âm lịch`,
    solar
      ? `${day.weekday}, ngày ${solar.day} tháng ${solar.month}`
      : day.weekday,
    ...day.highlights.map(h => h.text),
  ].join('. ');
}

interface ColumnProps {
  readonly view: DayView;
  readonly palette: WidgetPalette;
}

/** Như trong app: sự kiện cá nhân màu xanh, ngày nghỉ lễ màu đỏ son, ngày kỷ niệm chữ thường. */
const highlightColor = (
  { kind }: WidgetHighlight,
  isRedDay: boolean,
  palette: WidgetPalette,
): HexColor =>
  kind === 'event' ? palette.event : isRedDay ? palette.primary : palette.text;

/** Trăng ở góc trên; dưới cùng là ngày âm (tiêu đề), ngày dương và ngày lễ / sự kiện hôm nay. */
function DayColumn({
  view,
  palette,
  width,
  titleLines,
  showHighlight,
}: ColumnProps & {
  readonly width: number | 'match_parent';
  readonly titleLines: number;
  readonly showHighlight: boolean;
}) {
  const { day, solar, lunar, phase } = view;
  const isMoonDay = lunar?.day === 1 || lunar?.day === 15;
  const highlight = showHighlight ? day.highlights[0] : undefined;
  return (
    <FlexWidget
      style={{
        width,
        height: 'match_parent',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <SvgWidget
        svg={moonSvg(phase, palette, MOON_SIZE)}
        style={{ width: MOON_SIZE, height: MOON_SIZE }}
      />
      <FlexWidget style={{ width: 'match_parent', flexDirection: 'column' }}>
        <TextWidget
          text={lunar ? lunarTitle(lunar) : day.lunar}
          maxLines={titleLines}
          truncate="END"
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: isMoonDay ? palette.lunarAccent : palette.text,
          }}
        />
        <TextWidget
          text={
            solar ? `${day.weekday}, ${solar.day}/${solar.month}` : day.weekday
          }
          maxLines={1}
          truncate="END"
          style={{
            fontSize: 14,
            color: day.isRedDay ? palette.primary : palette.textMuted,
            marginTop: 2,
          }}
        />
        {highlight ? (
          <TextWidget
            text={highlight.text}
            maxLines={1}
            truncate="END"
            style={{
              fontSize: 12,
              color: highlightColor(highlight, day.isRedDay, palette),
              marginTop: 2,
            }}
          />
        ) : null}
      </FlexWidget>
    </FlexWidget>
  );
}

/** Ký hiệu đầu hàng (dp): vòng / đĩa trăng cỡ này, chấm sự kiện nhỏ hơn - như trong app. */
const MARK_SIZE = 10;
const DOT_SIZE = 8;
const RING_WIDTH = 1.6;

/** Chấm đặc = sự kiện, đĩa trăng = rằm, vòng màu trăng = mùng 1, vòng đỏ = ngày lễ. */
function markSvg(mark: UpcomingKind, palette: WidgetPalette): string {
  const r = MARK_SIZE / 2;
  const svg = (shape: string): string =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${MARK_SIZE}" height="${MARK_SIZE}" ` +
    `viewBox="${-r} ${-r} ${MARK_SIZE} ${MARK_SIZE}">${shape}</svg>`;
  const ring = (color: HexColor): string =>
    svg(
      `<circle r="${r - RING_WIDTH / 2}" fill="none" stroke="${color}" stroke-width="${RING_WIDTH}"/>`,
    );
  switch (mark) {
    case 'event':
      return svg(`<circle r="${DOT_SIZE / 2}" fill="${palette.event}"/>`);
    case 'fullMoon':
      return svg(`<circle r="${r}" fill="${palette.moonLit}"/>`);
    case 'newMoon':
      return ring(palette.lunarAccent);
    case 'holiday':
      return ring(palette.primary);
  }
}

function UpcomingRow({
  item,
  palette,
}: {
  readonly item: WidgetUpcoming;
  readonly palette: WidgetPalette;
}) {
  const soon = (daysAway(item) ?? 2) <= 1;
  return (
    <FlexWidget
      style={{
        width: 'match_parent',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
      }}
    >
      <SvgWidget
        svg={markSvg(item.mark, palette)}
        style={{ width: MARK_SIZE, height: MARK_SIZE, marginRight: 8 }}
      />
      <FlexWidget style={{ flex: 1 }}>
        <TextWidget
          text={item.title}
          maxLines={1}
          truncate="END"
          style={{ width: 'match_parent', fontSize: 14, color: palette.text }}
        />
      </FlexWidget>
      <TextWidget
        text={shortWhen(item)}
        maxLines={1}
        style={{
          fontSize: 14,
          color: soon ? palette.primary : palette.textMuted,
          marginLeft: 8,
        }}
      />
    </FlexWidget>
  );
}

/** Danh sách "Sắp tới" dạng hàng trơn; không có sự kiện thì hiện can chi, canh đáy. */
function UpcomingColumn({ view: { day }, palette }: ColumnProps) {
  if (day.upcoming.length === 0) {
    return (
      <FlexWidget
        style={{
          flex: 1,
          height: 'match_parent',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          marginLeft: COLUMN_GAP,
        }}
      >
        {day.canChi.split(' · ').map(line => (
          <TextWidget
            key={line}
            text={line}
            maxLines={1}
            truncate="END"
            style={{ fontSize: 14, color: palette.textMuted }}
          />
        ))}
      </FlexWidget>
    );
  }
  return (
    <FlexWidget
      style={{
        flex: 1,
        height: 'match_parent',
        flexDirection: 'column',
        marginLeft: COLUMN_GAP,
      }}
    >
      <TextWidget
        text="Sắp tới"
        style={{ fontSize: 14, fontWeight: '500', color: palette.primary }}
      />
      {day.upcoming.map(item => (
        <UpcomingRow
          key={`${item.title}-${item.date}`}
          item={item}
          palette={palette}
        />
      ))}
    </FlexWidget>
  );
}

function TodayWidgetView({
  view,
  size,
  palette,
}: ColumnProps & { readonly size: WidgetSize }) {
  const wide = size.width >= WIDE_MIN_WIDTH;
  const content = size.width - 2 * PADDING;
  // Chỗ cho khối chữ bên dưới mặt trăng; chữ to (cài đặt máy) thì mỗi dòng cao hơn.
  const fontScale = PixelRatio.getFontScale();
  const room = size.height - 2 * PADDING - MOON_SIZE - 4;
  const titleLines = room >= (2 * LINE.title + LINE.solar) * fontScale ? 2 : 1;
  const showHighlight =
    room >= (titleLines * LINE.title + LINE.solar + LINE.highlight) * fontScale;
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'lichviet://today' }}
      accessibilityLabel={spokenSummary(view)}
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'row',
        padding: PADDING,
        borderRadius: RADIUS,
        backgroundColor: palette.background,
      }}
    >
      <DayColumn
        view={view}
        palette={palette}
        width={
          wide ? Math.round((content - COLUMN_GAP) * 0.44) : 'match_parent'
        }
        titleLines={titleLines}
        showHighlight={showHighlight}
      />
      {wide ? <UpcomingColumn view={view} palette={palette} /> : null}
    </FlexWidget>
  );
}

/** Hai phiên bản sáng/tối - launcher tự chọn theo chế độ của máy. */
export function renderTodayWidget(day: WidgetDay, size: WidgetSize) {
  const view = toDayView(day);
  return {
    light: <TodayWidgetView view={view} size={size} palette={LIGHT} />,
    dark: <TodayWidgetView view={view} size={size} palette={DARK} />,
  };
}
