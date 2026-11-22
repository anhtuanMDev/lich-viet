---
version: 1
slug: "src-app"
primary_target: "src/app"
related_targets: ["src/features","src/shared/ui","ios/LichVietWidget"]
---

# Lịch Việt app shell (all screens, widget, app icon)

Scope: every screen in the app (Hôm nay, Lịch, Sự kiện, Đổi ngày, Chi tiết ngày, Thêm/sửa sự kiện, Cài đặt, Nhập dữ liệu), the home-screen widgets (iOS SwiftUI, Android), and the app icon. Mode: Operate.

Audience and job: Vietnamese adults 25-45 who keep the family's lunar dates (ngày giỗ, sinh nhật âm, mùng 1, rằm). Glance at today's lunar date, see what is coming, add an event, get reminded.

User feedback driving the redesign: the old UI is too big, cramped and untidy, generic, a stack of identical cards, and not native. User picked the category standard (canon), then asked for: less AI look, a signature of its own, borrowing from other directions, and no cards. Benchmarks: Apple Calendar, Google Calendar, Fantastical, Things 3. System fonts only.

## Direction contract

THESIS: Lịch Việt looks like it shipped with the phone (Apple Calendar on iPhone, Google Calendar on Android, at Things 3 tidiness) and owns one thing no stock calendar has: the real moon. Refuses red-gold Tết decoration, card stacks, giant numerals and tracked uppercase labels.

OWN-WORLD: iOS system grounds (white / black), Android M3 tonal surfaces from a son-red seed. One tint, son red #C8281E (dark #FF6B5B), also Sunday and public holidays. Lunar information in moon amber (#B26A00 text, #E2A23B disc). Personal events blue dots, holidays son rings. No cards: content sits on the ground in plain lists, sections set apart by a bold sentence-case header (iOS) or a primary-colored title-small subheader (Android), hairline separators on iOS only. System type scales (SF Pro text styles, M3 roles). Icons: SF Symbols in the native iOS tab bar, Material Symbols on Android, authored SVG in-app matching each platform's stroke.

STORY: open the app, see the moon and today's lunar date, see the next three things to prepare for with days remaining, check whether the day and hour are good; tap into the month to plan; add an event in a native modal.

FIRST VIEWPORT (Hôm nay): native large title "Hôm nay" with + and settings in the nav bar (iOS) / top app bar actions + FAB (Android). Below, a 40pt moon drawn at today's true phase beside "14 tháng Mười" (title) and "Chủ nhật, 22 tháng 11, 2026" (secondary). Then "Sắp tới" (three rows, leading moon or dot, trailing days remaining), "Ngày Canh Tý" (hoàng/hắc đạo, tiết khí, tháng năm), "Giờ hoàng đạo" as a 24-hour strip of twelve exact 2-hour segments with a now marker. Native tab bar (SF Symbols / M3 navigation bar).

FORM: canon (category standard), raised with borrowed pieces: 24-hour giờ hoàng đạo strip (from Biển Phố Tráng Men), "Sắp tới" with days remaining (from Sơ Đồ Tuyến Đêm), state by shape not only color (from the emission-rail challenger), hairline separation with destructive actions isolated (from the console challenger). Signature move: the moon at its true phase on Today, Day detail, month grid (mùng 1 ring, rằm disc), widget and app icon. seed:f4572eb559bdd68b

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
