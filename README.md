# Lịch Việt

Ứng dụng xem lịch dương - âm cho người Việt Nam. React Native CLI 0.87 (New Architecture, Hermes), TypeScript strict.

## Bắt đầu

```sh
nvm use              # Node 24 (xem .nvmrc) - RN 0.87 yêu cầu Node >= 22.13
npm install
npm run pods         # lần đầu, hoặc khi thêm thư viện native (cần `bundle install` trước)
npm start
npm run ios          # hoặc npm run android
```

| Lệnh | Việc |
|---|---|
| `npm run verify` | typecheck + lint + test - chạy trước mỗi commit/PR |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Jest, gồm golden tests đối chiếu âm lịch từng ngày 1900-2100 |

## Cấu trúc

```
src/
├─ app/              # điểm vào, providers, điều hướng, đồng bộ nền (app/background)
├─ core/             # logic thuần TypeScript - KHÔNG import React/RN (ESLint chặn)
│  ├─ lunar/         # đổi lịch, can chi, tiết khí, hoàng đạo, ngày lễ, lưới tháng
│  ├─ events/        # mô hình sự kiện, tính các lần lặp (âm/dương), giải mã dữ liệu đã lưu
│  ├─ reminders/     # lập lịch nhắc theo ngày + nội dung thông báo (thuần, có test)
│  ├─ widget/        # dữ liệu hiển thị cho widget (snapshot có phiên bản)
│  └─ date/          # giờ Việt Nam (UTC+7), định dạng tiếng Việt, deep-link date
├─ features/         # mỗi tính năng một thư mục: Screen + components/ + hooks/ + logic thuần
│  ├─ today/
│  ├─ calendar/
│  ├─ day-detail/
│  ├─ converter/
│  ├─ events/        # repository + danh sách + form thêm/sửa
│  ├─ reminders/     # notifier (notify-kit), đồng bộ lịch nhắc, quyền, UI cài đặt nhắc
│  ├─ widget/        # widget Android (JSX), đẩy dữ liệu cho widget iOS, thẻ cài đặt widget
│  └─ settings/
└─ shared/
   ├─ theme/         # tokens sáng/tối, createThemedStyles, ThemeMode
   ├─ ui/            # AppText, Card, Button, TextField, SegmentedControl…
   ├─ date-input/    # ô nhập ngày/tháng/năm + kiểm tra hợp lệ (dùng chung Đổi ngày & Sự kiện)
   ├─ storage/       # MMKV + persistent store có phiên bản schema
   └─ hooks/
```

Alias import: `@app/*`, `@core/*`, `@features/*`, `@shared/*` (khai báo ở `tsconfig.json`, `babel.config.js`, `jest.config.js`).

Hướng phụ thuộc: `app → features → shared → core`. `core` không phụ thuộc gì để có thể test độc lập và dùng lại cho widget / thông báo.

## Độ chính xác âm lịch

- Thuật toán của TS. Hồ Ngọc Đức với **múi giờ UTC+7**. Không dùng thư viện âm lịch Trung Quốc (UTC+8) vì lệch ngày ở nhiều năm (VD Tết 1985, Tết 2007).
- `src/core/lunar/__tests__/golden.test.ts` so khớp **mọi ngày 1900-2100** với một bản cài đặt độc lập (`@tuquet/lunar`, chỉ là devDependency).
- Đã sửa lỗi "mùng 0" của thuật toán gốc: các ngày 7/5/2054 và 9/4/2062 bị tính thành ngày 0. Thư viện tham chiếu cũng dính lỗi này; test ghi nhận rõ ngoại lệ.
- Ngày hoàng đạo / giờ hoàng đạo đã đối chiếu với `@lunar-calendar/sdk` trong 30 năm (2000-2029): khớp 100%.
- **Không sửa kỳ vọng của golden tests để test xanh.** Nếu đỏ, nghĩa là kết quả đổi lịch đã thay đổi.

## Lưu trữ dữ liệu

- Chỉ dùng **MMKV** (`shared/storage`). Dữ liệu người dùng nhỏ (vài trăm sự kiện), đọc đồng bộ nên không có trạng thái "đang tải".
- Mỗi loại dữ liệu là một `createPersistentStore` dưới một key, ghi dạng `{ v: <version>, data }`. Khi đọc, dữ liệu được giải mã/kiểm tra (`core/events/decode.ts`, `decodeSettings`): bản ghi hỏng bị bỏ qua, app không crash.
- Đổi cấu trúc dữ liệu → tăng `version` và xử lý phiên bản cũ trong `decode`.
- Màn hình chỉ truy cập sự kiện qua `features/events/eventRepository.ts`. Nếu sau này cần SQLite, chỉ thay file này.
- **Sao lưu:** Android Auto Backup bật cho riêng thư mục `files/mmkv/` (`res/xml/backup_rules.xml` cho Android ≤ 11, `data_extraction_rules.xml` cho 12+, gồm cả chuyển dữ liệu khi đổi máy); lịch thông báo đã đặt không được sao lưu - app tự đặt lại khi mở. iOS: MMKV nằm trong `Documents/mmkv` nên đi theo bản sao lưu iCloud/máy tính. Thêm xuất/nhập thủ công (Cài đặt → Sao lưu dữ liệu): định dạng `{ app, format, exportedAt, events }` (`core/events/backup.ts`), khi nhập gộp theo id, giữ bản sửa sau cùng, không xoá gì.
- Jest thay MMKV và các thư viện native (thông báo, chạy nền, widget) bằng bản giả (`jest.setup.ts`).

## Quy ước sự kiện âm lịch lặp hằng năm

- Ngày gốc ở tháng nhuận → các năm sau tính theo tháng thường cùng số.
- Ngày 30 gặp tháng thiếu (29 ngày) → tính vào ngày 29.
- Sự kiện dương lịch 29/2 → 28/2 ở năm không nhuận.

## Nhắc lịch

- Thông báo **cục bộ, đặt trước** (`react-native-notify-kit`) - hệ điều hành tự hiện đúng giờ kể cả khi app đã tắt; không cần server.
- Mọi lời nhắc của cùng một ngày gộp thành **một thông báo**, id `daily-<ngày>` nên đặt lại không tạo trùng.
- Giới hạn: iOS giữ tối đa 64 thông báo chờ → đặt trước 60 ngày có nhắc (trong 120 ngày tới). Android đặt 150 (trong 180 ngày).
- `syncReminders()` là điểm đồng bộ duy nhất: chạy khi mở app / quay lại app / sửa sự kiện hoặc cài đặt (debounce), và chạy nền mỗi ~12 giờ (`react-native-background-fetch`, Android chạy cả khi app đã tắt). Các lần gọi dồn dập được gộp, không chạy song song.
- Xin quyền thông báo đúng lúc người dùng bật một lời nhắc, không xin khi mở app.
- Android: `USE_EXACT_ALARM` (app lịch) - **phải khai báo mục đích "Calendar" trong Play Console**. Màn Cài đặt hướng dẫn tắt tối ưu pin / bật tự khởi chạy (Xiaomi, Oppo, Vivo…).
- Bấm thông báo → deep link `lichviet://day/YYYY-MM-DD` (xử lý trong `app/navigation/linking.ts`).
- Tác vụ nền (`index.js`) chỉ import module dữ liệu, không import màn hình/navigation để khởi động nhanh.

## Widget màn hình chính

- `core/widget/snapshot.ts` tạo dữ liệu hiển thị (chuỗi đã định dạng) - **đổi cấu trúc thì tăng `WIDGET_SNAPSHOT_VERSION` và sửa `ios/LichVietWidget/LichVietWidget.swift` cho khớp**.
- **Android** (`react-native-android-widget`): widget vẽ bằng JSX (`features/widget/android/TodayWidget.tsx`), chạy headless qua `widgetTaskHandler` (đăng ký ở `index.js`), tự cập nhật mỗi 30 phút. Native: `android/.../widget/Today.java`, receiver trong `AndroidManifest.xml`, `res/xml/widgetprovider_today.xml`. Kéo rộng ≥ 250dp hiện cột "Sắp tới".
- **iOS** (WidgetKit, target `LichVietWidget`): app ghi snapshot 60 ngày vào App Group `group.com.lichviet.app` qua native module `WidgetBridge`; widget SwiftUI chỉ đọc và tự sang ngày mới lúc 0h giờ Việt Nam. Hết dữ liệu → widget nhắc mở app. Cỡ nhỏ và vừa.
- `app/background/syncAll.ts` cập nhật lịch nhắc + widget: khi mở/quay lại app, khi dữ liệu đổi, và chạy nền ~12 giờ/lần.
- **Cần làm khi ký app thật**: bật App Groups (`group.com.lichviet.app`) cho cả `com.lichviet.app` và `com.lichviet.app.widget` trong Apple Developer, chọn Team cho cả hai target.

## Báo cáo lỗi (Firebase Crashlytics)

- Mọi code gọi qua `@shared/crash` (`reportError(error, 'nhãn')`, `initCrashReporting()` ở `index.js`); không import Firebase trực tiếp. **Không đưa nội dung người dùng nhập (tên sự kiện, ghi chú) vào lỗi/log** - chính sách quyền riêng tư cam kết điều này.
- `ErrorBoundary` (`src/app`) bọc toàn bộ điều hướng: lỗi render → màn hình "Đã xảy ra lỗi" + nút "Thử lại", gửi báo cáo non-fatal.
- Người dùng tắt được ở Cài đặt → "Gửi báo cáo lỗi" (`settings.crashReports`, mặc định bật). Bản debug không gửi (`firebase.json`: `crashlytics_debug_enabled: false`).
- **Chưa có file cấu hình Firebase thì app vẫn build và chạy**, Crashlytics tự thành no-op (Gradle chỉ áp plugin khi có file; iOS bỏ qua bước Crashlytics qua `scripts/ios-crashlytics-phase.sh`). Build release Android thiếu file sẽ in cảnh báo.
- Bật thật:
  1. Firebase Console → tạo project → thêm app Android `com.lichviet.app` và iOS `com.lichviet.app` (**chốt bundle id trước** - đổi sau phải đăng ký lại). Không cần bật Google Analytics.
  2. Tải `google-services.json` → `android/app/`.
  3. Tải `GoogleService-Info.plist` → kéo vào Xcode, target `LichViet` (tick "Copy items if needed").
  4. Build release: plugin tự tải mapping R8 (Android) và dSYM (iOS) để giải mã stack trace.
- iOS cài Firebase qua CocoaPods với static frameworks (`$RNFirebaseDisableSPM` trong `Podfile`) để giữ khởi động nhanh. Firebase ngừng phát hành bản mới lên CocoaPods từ 10/2026 - khi `@react-native-firebase` yêu cầu SDK mới hơn 12.18, chuyển sang SPM (bỏ cờ, `use_frameworks! :linkage => :dynamic`).

## Icon

- **Icon app** dùng ảnh thiết kế, nguồn ở `assets/logo/` (`background.png`, `foreground.png`):
  - Android: Android Studio → New → Image Asset (Launcher Icons, Adaptive) với hai lớp trên → `mipmap-*/ic_launcher*.webp`, `mipmap-anydpi-v26/ic_launcher*.xml`, `src/main/ic_launcher-playstore.png` (chép sang `docs/store/assets/play-icon-512.png` cho Play).
  - iOS: `ios/LichViet/Images.xcassets/AppIcon.appiconset` (đủ các cỡ). **PNG không được có kênh alpha** - App Store từ chối; kiểm tra bằng `sips -g hasAlpha`.
- `scripts/generate-icons.js` chỉ còn sinh icon thông báo `ic_notification` (trắng đơn sắc), màu nhấn thông báo và ảnh nổi bật Google Play (`docs/store/assets/feature-graphic-1024x500.png`). Script **không** đụng tới icon app.

## Phát hành

### Android - khoá ký (upload key)

- Tạo một lần trên máy: `./scripts/create-upload-keystore.sh` → tạo `~/.lichviet-signing/upload-keystore.jks` (PKCS12, RSA 4096) và ghi 4 dòng `LICHVIET_UPLOAD_*` vào `~/.gradle/gradle.properties` (chmod 600). Script không ghi đè khoá đã có và không in mật khẩu.
- **Sao lưu ngay** file `.jks` và 4 dòng `LICHVIET_UPLOAD_*` vào trình quản lý mật khẩu. Mất khoá thì phải xin Google reset upload key (Play App Signing giữ khoá ký thật).
- CI: truyền 4 biến cùng tên qua biến môi trường thay cho `gradle.properties`.
- Build: `cd android && ./gradlew bundleRelease` (AAB cho Play) hoặc `assembleRelease` (APK cài thử). Thiếu khoá → build release dừng với thông báo rõ ràng; debug không bị ảnh hưởng.
- Release bật R8 (`minifyEnabled` + `shrinkResources`). Các thư viện native đã có consumer rules; đã kiểm tra trên bản release: lưu MMKV, deep link, đặt alarm nhắc lịch.
- Mỗi lần phát hành tăng `versionCode` (và `versionName`) trong `android/app/build.gradle`.

### iOS

- Cả hai target dùng `CODE_SIGN_STYLE = Automatic`; chọn Team trong Xcode (Signing & Capabilities) cho `LichViet` và `LichVietWidget`, bật App Groups như mục Widget.

### Store & quyền riêng tư

- Chính sách quyền riêng tư: `docs/privacy-policy.md`, công khai tại `https://portfolio-three-theta-41.vercel.app/lich-viet/privacy-policy/` (trang `src/pages/lich-viet/privacy-policy.tsx` trong repo `anhtuanMDev/portfolio`, Vercel tự deploy khi push `main`) - link này nằm trong Cài đặt của app. Sửa chính sách → sửa cả hai nơi.
- Khai báo store: `docs/store/google-play.md` (Data safety, USE_EXACT_ALARM, content rating…), `docs/store/app-store.md` (App Privacy, age rating…), `docs/store/listing.md` (tên, mô tả, từ khoá).
- Đổi dữ liệu thu thập / quyền / SDK → cập nhật cả chính sách, các file khai báo và `PrivacyInfo.xcprivacy`.

## Quy ước code

- TypeScript strict + `noUncheckedIndexedAccess`; kiểu "đóng dấu" `JulianDay` để không truyền nhầm số bất kỳ.
- Style: `createThemedStyles(theme => ({...}))` ở cuối file component; không dùng inline style (ESLint báo lỗi).
- `memo` chỉ dùng cho component nằm trên đường render nóng (ô lịch, lưới tháng, header), đặt tên hàm `XxxView`: `export const DayCell = memo(function DayCellView(...) {...})`. Component lá đơn giản dùng `function` thường.
- Logic tính toán đặt ở file `.ts` thuần (VD `shared/date-input/dateInput.ts`, `features/events/eventForm.ts`) và có test; hook chỉ nối logic với React state.
- Tham số điều hướng là dữ liệu thuần (VD `SolarDate`) để có thể serialize.
- Deep link: `lichviet://today | calendar | events | convert | settings | event/new | day/YYYY-MM-DD` (`app/navigation/linking.ts`).
