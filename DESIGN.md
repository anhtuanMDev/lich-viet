---
name: Lịch Việt
description: A Vietnamese lunar-solar calendar that looks as if it shipped with the phone and owns one thing no stock calendar has, the real moon.
colors:
  primary: "#C8281E"
  onPrimary: "#FFFFFF"
  primaryContainer: "#FBE9E7"
  onPrimaryContainer: "#8E1B14"
  secondaryContainer: "#EFEFF1"
  onSecondaryContainer: "#000000"
  holiday: "#C8281E"
  moonLit: "#E2A23B"
  lunarAccent: "#9A5B00"
  moonShade: "#E5E5EA"
  event: "#2F6FDB"
  auspicious: "#248A3D"
  danger: "#D70015"
  background: "#FFFFFF"
  surface: "#FFFFFF"
  fill: "#EFEFF1"
  separator: "#D1D1D6"
  outline: "#C7C7CC"
  text: "#000000"
  textMuted: "#6E6E73"
  textFaint: "#AEAEB2"
  segmentThumb: "#FFFFFF"
typography:
  largeTitle:
    fontFamily: "-apple-system, system-ui, Roboto, sans-serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: "41px"
    letterSpacing: "0.37px"
  title:
    fontFamily: "-apple-system, system-ui, Roboto, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: "28px"
    letterSpacing: "0.35px"
  headline:
    fontFamily: "-apple-system, system-ui, Roboto, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "25px"
    letterSpacing: "0.38px"
  body:
    fontFamily: "-apple-system, system-ui, Roboto, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "22px"
    letterSpacing: "-0.41px"
  bodyStrong:
    fontFamily: "-apple-system, system-ui, Roboto, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: "22px"
    letterSpacing: "-0.41px"
  subhead:
    fontFamily: "-apple-system, system-ui, Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: "-0.24px"
  footnote:
    fontFamily: "-apple-system, system-ui, Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "18px"
    letterSpacing: "-0.08px"
  caption:
    fontFamily: "-apple-system, system-ui, Roboto, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: "13px"
    letterSpacing: "0.06px"
  button:
    fontFamily: "-apple-system, system-ui, Roboto, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: "22px"
    letterSpacing: "-0.41px"
rounded:
  field: "10px"
  dialog: "14px"
  pill: "999px"
spacing:
  xxs: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  xxl: "32px"
  gutter: "20px"
components:
  button-filled:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.onPrimary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    height: "50px"
    padding: "0 20px"
  button-tonal:
    backgroundColor: "{colors.secondaryContainer}"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    height: "50px"
    padding: "0 20px"
  button-plain:
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    height: "50px"
    padding: "0"
  button-destructive:
    textColor: "{colors.danger}"
    typography: "{typography.button}"
    height: "50px"
    padding: "0"
  button-small:
    backgroundColor: "{colors.secondaryContainer}"
    textColor: "{colors.primary}"
    typography: "{typography.subhead}"
    rounded: "{rounded.pill}"
    height: "34px"
    padding: "0 14px"
  section-header:
    textColor: "{colors.text}"
    typography: "{typography.headline}"
    padding: "20px 20px 4px"
  list-row:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    height: "44px"
    padding: "10px 20px"
  list-row-pressed:
    backgroundColor: "{colors.fill}"
  action-row:
    textColor: "{colors.primary}"
    typography: "{typography.body}"
    height: "44px"
    padding: "10px 20px"
  action-row-destructive:
    textColor: "{colors.danger}"
    typography: "{typography.body}"
    height: "44px"
    padding: "10px 20px"
  segmented-track:
    backgroundColor: "{colors.fill}"
    rounded: "{rounded.pill}"
    padding: "2px"
  segmented-thumb:
    backgroundColor: "{colors.segmentThumb}"
    textColor: "{colors.text}"
    typography: "{typography.footnote}"
    rounded: "{rounded.pill}"
    height: "32px"
    padding: "0 8px"
  text-field:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    height: "44px"
    padding: "0 12px"
  day-cell-today:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.onPrimary}"
    typography: "{typography.bodyStrong}"
    rounded: "{rounded.pill}"
    size: "34px"
  moon-header:
    backgroundColor: "{colors.moonShade}"
    rounded: "{rounded.pill}"
    size: "44px"
  mark-event:
    backgroundColor: "{colors.event}"
    rounded: "{rounded.pill}"
    size: "9px"
  mark-full-moon:
    backgroundColor: "{colors.moonLit}"
    rounded: "{rounded.pill}"
    size: "12px"
  hour-good:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    height: "8px"
  hour-ordinary:
    backgroundColor: "{colors.textFaint}"
    rounded: "{rounded.pill}"
    height: "2px"
  fab:
    backgroundColor: "{colors.primaryContainer}"
    textColor: "{colors.onPrimaryContainer}"
    rounded: "16px"
    size: "56px"
---

# Design System: Lịch Việt

## Overview

**Creative North Star: "The Native Almanac"**

Lịch Việt should look as if it came in the box: Apple Calendar on an iPhone, Google Calendar on an Android phone, kept at Things 3 tidiness. It is a React Native app with one identity and two native dialects. iOS speaks in system grounds (white or black), SF Pro text styles, large titles, inset hairlines and a floating Liquid Glass tab bar. Android speaks Material 3: tonal surfaces seeded from son red, M3 type roles, primary-coloured subheaders, a navigation bar with a pill indicator, and a FAB. Every token is a role (`primary`, `fill`, `textMuted`) that resolves to a different value per platform and per light or dark theme; components are written once against roles.

Against that deliberately stock canvas the app owns one thing a stock calendar does not have: the real moon. A plain disc drawn at today's true phase sits beside the lunar date on Hôm nay and Chi tiết ngày, shrinks to a disc or ring on mùng 1 and rằm in the month grid, leads the home-screen widgets, and is the app icon (a waxing moon on son red). The other borrowed signature is the 24-hour giờ hoàng đạo strip: twelve equal two-hour segments, good hours a thick son-red pill, ordinary hours a thin track, a vertical now marker.

The density is calm and list-shaped. Content sits directly on the ground in plain lists; there are no cards. Hierarchy comes from weight and colour inside the system type scale, never from oversized numerals or tracked labels. One tint carries every interactive accent. The system refuses red-and-gold Tết decoration, card stacks, giant numerals and tracked uppercase labels.

**Key Characteristics:**
- Adaptive: iOS system look on iPhone and iPad, Material 3 on Android, one set of role tokens resolved per platform and theme.
- One tint, son red, which is also the colour of Sundays and public holidays.
- Moon amber belongs to lunar information only.
- Marks and states differ by shape first, colour second.
- No cards: sections on the ground, separated by headers and space.
- System fonts and system type scales only.
- Flat on iOS, tonal on Android; two shadows in the whole app.

## Colors

One warm red tint over neutral system grounds, with moon amber reserved for the lunar layer and a family blue for personal events. Frontmatter values are the iOS light set; the table below gives every role on all four platform and theme sets, and component token references resolve to whichever set the device is on.

| Role | iOS light | iOS dark | Android light | Android dark |
|---|---|---|---|---|
| primary | #C8281E | #FF5F52 | #AF2C21 | #FFB4A9 |
| onPrimary | #FFFFFF | #FFFFFF | #FFFFFF | #690002 |
| primaryContainer | #FBE9E7 | #3B1613 | #FFDAD5 | #8C1D15 |
| onPrimaryContainer | #8E1B14 | #FFB4AB | #410001 | #FFDAD5 |
| secondaryContainer | #EFEFF1 | #2C2C2E | #F7DCD8 | #5D3F3B |
| onSecondaryContainer | #000000 | #FFFFFF | #2C1512 | #FFDAD5 |
| holiday | #C8281E | #FF5F52 | #AF2C21 | #FFB4A9 |
| moonLit | #E2A23B | #F2C36B | #E2A23B | #F2C36B |
| lunarAccent | #9A5B00 | #F2B04F | #8B5000 | #FFB95C |
| moonShade | #E5E5EA | #3A3A3C | #EADBD8 | #3D3231 |
| event | #2F6FDB | #64A0FF | #2F62C8 | #AFC6FF |
| auspicious | #248A3D | #30D158 | #2E6B30 | #90D88E |
| danger | #D70015 | #FF6961 | #BA1A1A | #FFB4AB |
| background | #FFFFFF | #000000 | #FFF8F7 | #1A1110 |
| surface | #FFFFFF | #1C1C1E | #FCEAE7 | #271D1C |
| fill | #EFEFF1 | #2C2C2E | #F3E0DD | #3D3231 |
| separator | #D1D1D6 | #38383A | #EBDAD7 | #3D3231 |
| outline | #C7C7CC | #48484A | #857371 | #A08C8A |
| text | #000000 | #FFFFFF | #231918 | #F1DFDC |
| textMuted | #6E6E73 | #98989F | #534341 | #D8C2BF |
| textFaint | #AEAEB2 | #5A5A5F | #A08C8A | #857371 |
| segmentThumb | #FFFFFF | #636366 | #F7DCD8 | #5D3F3B |
| scrim | rgba(0,0,0,0.4) | rgba(0,0,0,0.4) | rgba(0,0,0,0.32) | rgba(0,0,0,0.32) |

The source of truth is `src/shared/theme/colors.ts`. The iOS widget mirrors the iOS sets in Swift and the Android widget imports the token sets directly; keep all three in step.

### Primary
- **Son Red** (`primary`): the single interactive tint. iOS bar buttons and back chevrons, filled and plain buttons, action rows, the selected tab, the today circle in the month grid, good-hour pills, the Android switch track, the "Mai" / one-day-left value in Sắp tới. On Android it also colours section subheaders. In dark mode it lightens so it still reads on black.
- **Son Holiday** (`holiday`): the same red, by convention of the paper calendar. Sunday and public-holiday solar dates, the CN weekday header, the holiday ring mark.
- **Son Blush** (`primaryContainer`) and **Deep Son** (`onPrimaryContainer`): the Android FAB container and its icon, nothing else.
- **Quiet Container** (`secondaryContainer`, `onSecondaryContainer`): the tonal button ground, the M3 navigation-bar active indicator, the selected M3 segment. On iOS it equals `fill`, so the tonal button is the system grey button.

### Secondary
- **Moon Amber** (`moonLit`): the lit part of every moon (header moon, widget moon, app icon) and the filled rằm disc.
- **Lunar Ink** (`lunarAccent`): the text-weight amber for lunar emphasis. The mùng 1 ring, the lunar label in a mùng 1 or rằm grid cell, the widget lunar title on moon days, tiết khí on its first day, the converted lunar date in Đổi ngày.
- **Moon Shadow** (`moonShade`): the unlit part of the disc, chosen to sit just off the ground so a new moon still reads as a disc.

### Tertiary
- **Family Blue** (`event`): personal events only (giỗ, sinh nhật). Always a filled dot.
- **Auspicious Green** (`auspicious`): the hoàng đạo value (e.g. Thanh Long). Hắc đạo values stay `textMuted`, not red.
- **Alert Red** (`danger`): destructive actions and field errors. Distinct from son red so deletion never looks like the brand tint.

### Neutral
- **Ground** (`background`): every screen. Pure white or black on iOS; a faint son-tinted white (#FFF8F7) or warm near-black on Android.
- **Surface** (`surface`): sheets, dialogs, the Android navigation bar (the M3 surface-container tone).
- **Fill** (`fill`): field grounds, the iOS segmented track, pressed rows and pressed day cells, the Android ripple colour.
- **Hairline** (`separator`): iOS row separators and the month grid's week rules.
- **Outline** (`outline`): Android segmented and stepper outlines, the Android switch's off track border.
- **Label** (`text`), **Secondary Label** (`textMuted`), **Faint Label** (`textFaint`): the three text weights. `textMuted` carries subtitles, trailing values and footnotes and is contrast-checked for small text. `textFaint` is for non-text tracks (ordinary hours) and disabled states, never for reading text.
- **Segment Thumb** (`segmentThumb`): the selected iOS segment (white in light, #636366 in dark).
- **Scrim** (`scrim`): the dimming layer behind centred dialogs (the month picker): 40% black on iOS, the M3 scrim at 32% on Android.

### Named Rules
**The One Tint Rule.** Son red is the only accent that means "you can press this" or "this is selected". There is no second brand colour; blue, green and amber are semantic, never decorative.

**The Moon Owns Amber Rule.** Amber appears only where the information is lunar: the moon, the mùng 1 and rằm marks, lunar labels, tiết khí. Never use it for a highlight, a badge or a Tết flourish.

**The Shape Before Colour Rule.** Every mark is told apart by shape as well as colour: filled blue dot = personal event, filled amber disc = rằm, amber ring = mùng 1, son-red ring = holiday; a thick pill = good hour, a thin track = ordinary hour. A new mark must pass in greyscale.

## Typography

**Display Font:** none (no display face; the largest type is the native large title)
**Body Font:** the system font: SF Pro on iOS, Roboto on Android (`-apple-system, system-ui, Roboto, sans-serif`)
**Label/Mono Font:** the same system font; tabular figures (`tabular-nums`) for grid dates and day counts

**Character:** The phone's own voice. No `fontFamily` is set anywhere in the app; the type ramp is SF Pro text styles on iOS and Material 3 type roles on Android, mapped onto one set of role names so components ask for `headline` or `body` and get the native answer.

### Hierarchy
Frontmatter carries the iOS values. Android maps the same role names to M3 roles:

| Role | iOS (SF text style) | Android (M3 role) | Where |
|---|---|---|---|
| largeTitle | Large Title 34/41, 700 | headlineMedium 28/36, 400 | Month header on Lịch; native large titles |
| title | Title 2 metrics 22/28, 600 | titleLarge 22/28, 400 | Lunar date beside the moon ("14 tháng Mười"); Android top app bar title |
| headline | Title 3 metrics 20/25, 700 | titleSmall 14/20, 500, in `primary` | Section headers ("Sắp tới", "Giờ hoàng đạo") |
| body | Body 17/22, 400 | bodyLarge 16/24, 400 | Row titles, grid dates, field text |
| bodyStrong | 17/22, 600 | titleMedium 16/24, 500 | Today's date in the grid, emphasised row text |
| subhead | Subheadline 15/20, 400 | bodyMedium 14/20, 400 | Solar date line under the lunar date, row subtitles |
| footnote | Footnote 13/18, 400 | bodySmall 12/16, 400 | Section footers, field labels, iOS segment labels |
| caption | Caption 2 11/13, 400 | labelSmall 11/16, 500 | Lunar day in grid cells, hour names under the strip |
| button | 17/22, 600 | labelLarge 14/20, 500 | Button and Android segment labels |

Text scales with the system setting under caps (`fontScaleLimit`): content in flexible layouts to 1.6×, text inside fixed frames (grid cells, tab bar, large numerals, segments) to 1.3×, and the twelve hour names under the strip to 1.1×, with the readable caption below the strip scaling fully. Every Text and TextInput sets `maxFontSizeMultiplier`.

### Named Rules
**The System Voice Rule.** System fonts only. Never set a font family, import a web or brand font, or draw a numeral larger than the native large title.

**The Weight Not Size Rule.** Hierarchy comes from weight and colour within the system ramp. The lunar date is a 22pt title beside a moon, not a giant number.

**The Sentence Case Header Rule.** Section headers are sentence case. iOS: bold 20pt `headline` in `text`. Android: M3 titleSmall in `primary`. Never tracked uppercase.

## Layout

Single column, list-shaped, on the ground. The horizontal gutter is 20pt on iOS (the system table inset) and 16dp on Android (the Material grid); the frontmatter `gutter` is the iOS value. Spacing steps are 2, 4, 8, 12, 16, 20, 32.

A section opens with 20pt (iOS) or 16dp (Android) of space above its header and 4pt / 8dp between header and first row. Rows are at least 44pt (iOS) or 56dp (Android) tall, with 10pt / 8dp vertical padding. Leading columns are 20pt / 24dp wide with a 12pt / 16dp gap to the text; on iOS the hairline separator starts at the text (or after the leading column, or after a custom date column as in "Trong tháng"), never at the screen edge. Section footers are `footnote` in `textMuted`, 4pt under the last row. Touch targets are at least 44pt / 48dp; 40dp Material buttons get 4dp hit slop.

On wide screens (iPad, Android tablets) content keeps a readable width: the scrolling column is centred at a maximum of 820, like UIKit's readable content guide, and the month grid is capped at 600 so cells stay close to square (height 1.05× width, never shorter than their text at the capped font scale). Screens with a FAB reserve 96dp at the bottom so the last row clears it.

The month grid is the one place a hairline appears on Android: its week rows are divided by a `separator` rule on both platforms, as in both Apple and Google Calendar. Out-of-month days drop to 35% opacity.

### Named Rules
**The Ground Rule.** No cards. Content sits directly on `background`; sections are separated by a header and space. iOS adds inset hairlines between rows; Android rows have none.

**The Readable Column Rule.** On tablets nothing stretches edge to edge: lists stop at 820 and the month grid at 600, centred.

## Elevation & Depth

Flat by default. iOS is flat: depth comes from the system's own materials (large-title bar blur on scroll, Liquid Glass tab bar and bar-button group, the native form sheet). Android is tonal: `background`, `surface` and the son-tinted containers step the layers, with the M3 navigation bar on `surface`. Pressed states are a `fill` ground (iOS rows and cells), a 0.6 opacity (iOS buttons) or a ripple in `fill` (Android). Dialogs sit on the `scrim` layer with no shadow of their own.

### Shadow Vocabulary
- **Segment lift** (iOS shadow: black, opacity 0.12, radius 4, offset 0 2): the selected thumb of the iOS segmented control only, mirroring UISegmentedControl.
- **FAB elevation** (Android `elevation: 3`): the Material 3 FAB only.

### Named Rules
**The Two Shadows Rule.** Exactly two shadows exist: the iOS segmented thumb and the Android FAB. Nothing else casts one: no row, sheet, chip or moon.

## Shapes

Circles and capsules, nothing in between unless the platform specifies it. Buttons, segmented tracks and thumbs, steppers, the today circle (34pt), every mark and the moon are full pills or circles (`pill`, 999). Platform-specified corners are kept as the platform draws them: iOS fields 10pt round on all corners, Android filled fields round only the top two corners at 4dp above an underline; dialogs 14pt on iOS and 28dp on Android; the Android FAB 16dp; the Android widget 24dp. Rings scale with their mark: 1/6 of the diameter, never thinner than 1.2; the holiday ring in lists is 1.6. Separators are hairlines (one device pixel). The moon is a plain disc with a straight-edged half and an elliptical terminator: no craters, no glow, no texture.

## Components

### Buttons
Native and quiet.
- **Shape:** full capsule (`pill`) on both platforms.
- **Filled:** `primary` ground, `onPrimary` label. iOS 50pt tall with 20pt side padding (the large system capsule); Android 40dp with 24dp padding and 48dp touch via hit slop.
- **Tonal:** `secondaryContainer` ground; label `primary` on iOS (the system grey button), `onSecondaryContainer` on Android.
- **Plain / Destructive:** text only, `primary` or `danger`. No side padding on iOS, 12dp on Android.
- **Small:** 34pt (iOS, `subhead` 600, 14pt padding) / 40dp (Android, 12dp padding), used in month headers and bars.
- **Pressed / Disabled:** iOS 0.6 opacity on press; Android ripple in `fill`. Disabled is 0.38 opacity on both.

### Segmented control
- **iOS:** `fill` capsule track with 2pt inset; the selected segment is a `segmentThumb` capsule with the segment-lift shadow; labels `footnote`, 600 when selected; 32pt tall.
- **Android:** M3 segmented button. Outlined capsule (`outline`, 1dp), 1dp dividers, selected segment filled `secondaryContainer` with an 18dp check icon and `onSecondaryContainer` label; labels `button`; 40dp tall.
- Labels stay on one line; segments share width by label length with a 56 minimum.

### Toggles and steppers
- **iOS:** the native UISwitch with a `primary` on-track and `fill` off-track; the time stepper is a `fill` capsule split by a hairline.
- **Android:** M3 switch, 52×32 track; off: `fill` with `outline` border and a 16dp `outline` thumb; on: `primary` with a 24dp `onPrimary` thumb; 150ms transition. Stepper buttons are 40dp outlined circles.

### Inputs / Fields
- **iOS:** `fill` ground, 10pt corners, 44pt tall, 12pt side padding, label above in `footnote` `textMuted`. Error adds a 1pt `danger` border.
- **Android:** M3 filled field: `fill` ground, 4dp top corners, 1dp `textMuted` underline, label inside; focus thickens the underline to 2dp `primary` and tints the label `primary`; error is a 2dp `danger` underline and `danger` label. 48dp tall, 16dp padding.

### Lists (the core pattern)
- **Section:** no container, no background. Optional header, rows, optional footer.
- **Section header:** see The Sentence Case Header Rule.
- **List row:** title `body`, optional subtitle `subhead` `textMuted`, optional trailing value in `textMuted` (or a semantic colour: `primary` for one day left, `auspicious`, `lunarAccent`), optional leading mark or icon, optional chevron on iOS when it opens a screen.
- **Action row:** iOS: the label is tinted `primary` text, like a button inside a system table; destructive actions are `danger` and centred, isolated in their own section. Android: a neutral M3 list item, `text` label with a leading Material Symbol in `textMuted`; destructive stays `danger`.

### Navigation
- **iOS:** native large titles in `text` with `primary` bar-button tint and no bar shadow; actions (+, settings) are SF Symbol bar buttons in the system's glass group; back button is chevron only. The tab bar is the native UITabBar: the iOS 26 floating Liquid Glass bar with SF Symbols on iPhone, the system top tab bar on iPad, selected tab in `primary`.
- **Android:** top app bar on `background`, title `title` at weight 400, 48dp icon buttons with `textMuted` icons and a `text` back arrow. M3 navigation bar on `surface`, always labelled; active item is a `secondaryContainer` pill indicator with `onSecondaryContainer` icon and label, inactive `textMuted`.
- **Primary add action:** + in the iOS nav bar; on Android a FAB instead (56dp, 16dp corners, `primaryContainer` with `onPrimaryContainer` icon, `elevation: 3`, 16dp from the edge above the navigation bar). The FAB never appears on iOS.
- **Icons:** SF Symbols in iOS native bars; Material Symbols elsewhere, Rounded on iOS and Outlined on Android, tinted by role, 24 default and 22 in rows.
- **Modals:** Chi tiết ngày is a native form sheet; add/edit event is a native modal; the month picker is a centred dialog on `surface` (max 360 wide, `dialog` corners) over the `scrim` layer.

### Moon (signature)
The real moon at the day's true phase. A `moonShade` disc with a `moonLit` half on the sunward side (right while waxing, left while waning) and an elliptical terminator scaled by |cos(2π·cycle)|, lit past half and shaded as a crescent. Below 2% illumination nothing is lit; above 98.5% the whole disc is lit. 44pt beside the lunar date on Hôm nay and in the day sheet, 34pt in the iOS widget, 32dp in the Android widget. Decorative: hidden from screen readers because the text beside it reads the date. No craters, no glow, no outline.

### Lunar and event marks (signature)
One mark set across the month grid, Sắp tới, day rows and widgets: personal event = filled `event` dot (9 in rows, 7 in the agenda and iOS widget, 5 in grid cells); rằm = filled `moonLit` disc; mùng 1 = `lunarAccent` ring; holiday = `holiday` ring. Moon and holiday marks are 12 in Sắp tới rows, 10 in the Android widget, 7 beside the lunar label in a grid cell and 5 in the cell's bottom mark row. Observance days (ngày kỷ niệm) get no mark.

### Giờ hoàng đạo strip (signature)
Twelve equal two-hour segments in a row with 3pt gaps, 8pt tall. Good hours are 8pt `primary` pills; ordinary hours are 2pt `textFaint` tracks. A 2×18pt `text` bar marks the current time at its exact position. Under it, the twelve branch names in `caption`: good hours `text` at 600, ordinary `textMuted`. A `footnote` `textMuted` line below spells out the next good hour or the full list of good hours.

### Month grid day cell
Solar day in `body` with tabular figures inside a 34pt circle: `primary` with `onPrimary` bold for today, `fill` while pressed, `holiday` numerals on Sundays and public holidays. The lunar day sits under it in `caption` `textMuted`, switching to `lunarAccent` at 600 with its moon mark on mùng 1 (written "1/10") and rằm. A 5pt mark row at the bottom always reserves its space so cells align.

### Home-screen widgets
- **iOS (SwiftUI):** system background; moon top-left, then the lunar title in `.headline` (`lunarAccent` on moon days, label colour otherwise), the solar line in `.subheadline` (son red on red days, secondary otherwise) and the first highlight in `.footnote`. The medium size adds a Sắp tới column: a `.footnote` semibold secondary label, then rows with the shared marks and right-aligned monospaced day counts, son red at one day or less. In accented rendering the moon's shade becomes the primary colour at 25%.
- **Android:** the same content drawn with the Android token sets: `background` ground, 16dp padding, 24dp corners, 32dp SVG moon, lunar title 16/500, solar line 14, highlight 12, and a Sắp tới subheader at 14/500 in `primary`.

### App icon
A waxing moon on son red. No calendar page, pagoda roof or apricot blossom.

## Do's and Don'ts

### Do:
- **Do** write components against role tokens (`primary`, `fill`, `textMuted`) and let `src/shared/theme/colors.ts` resolve them for iOS or Android, light or dark.
- **Do** follow each platform's own convention when they differ: SF text styles, 44pt rows, inset hairlines and nav-bar actions on iOS; M3 roles, 56dp rows, primary subheaders, tonal surfaces and a FAB on Android.
- **Do** put content straight on `background` in plain sections, with a sentence-case header and space between sections.
- **Do** draw the moon at the true phase of the date being shown wherever a single day is the subject.
- **Do** give every new mark or state a distinct shape (filled, ring, thick, thin) before choosing its colour.
- **Do** set `maxFontSizeMultiplier` on every text: 1.6 for content, 1.3 inside fixed frames, 1.1 for the hour-name strip.
- **Do** cap wide layouts at 820 for lists and 600 for the month grid, centred.
- **Do** keep touch targets at 44pt (iOS) / 48dp (Android).

### Don't:
- **Don't** wrap content in cards, tiles or boxed panels, or stack identical cards.
- **Don't** use red-and-gold Tết decoration, lanterns, blossoms or gradients.
- **Don't** set display numerals larger than the native large title.
- **Don't** set section headers or labels in tracked uppercase.
- **Don't** load a custom font or set `fontFamily`.
- **Don't** add a second accent colour or use amber for anything that is not lunar.
- **Don't** add shadows beyond the iOS segmented thumb and the Android FAB.
- **Don't** draw hairline row separators on Android or show the FAB on iOS.
- **Don't** add craters, glow or texture to the moon.
- **Don't** tell marks apart by colour alone.
