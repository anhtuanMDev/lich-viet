# Khai báo Google Play Console

Trả lời theo đúng hành vi thật của app (bản 1.0.0). Đổi tính năng → cập nhật file này và khai báo lại.

## 1. Thiết lập ứng dụng (Policy → App content)

| Mục | Trả lời |
| --- | --- |
| Privacy policy | `https://portfolio-three-theta-41.vercel.app/lich-viet/privacy-policy/` |
| Ads | **No** – app không chứa quảng cáo |
| App access | **All functionality is available without special access** (không đăng nhập) |
| Content rating | Xem mục 2 |
| Target audience | **18 and over** (có thể chọn thêm 13–15, 16–17). Không chọn nhóm dưới 13 để không thuộc chương trình Families |
| "Appeal to children?" | **No** |
| News app | No |
| Government app | No |
| Financial features | My app doesn't provide any financial features |
| Health apps | My app does not have any health features |
| Data safety | Xem mục 3 |
| Advertising ID | **No** – app không dùng Advertising ID (Firebase Crashlytics không đọc AD_ID) |
| Exact alarm (USE_EXACT_ALARM) | Xem mục 4 |
| Foreground service | Không áp dụng – đã gỡ `FOREGROUND_SERVICE` khỏi manifest |

## 2. Content rating (IARC)

- Category: **All Other App Types** (Utility, Productivity, Communication, or Other).
- Mọi câu hỏi (bạo lực, tình dục, ngôn ngữ, chất kích thích, cờ bạc, tương tác người dùng, chia sẻ
  vị trí, mua hàng số…) → **No**.
- Kết quả dự kiến: **3+ / Everyone**.

## 3. Data safety

**Data collection and security**

| Câu hỏi | Trả lời |
| --- | --- |
| Does your app collect or share any of the required user data types? | **Yes** |
| Is all of the user data collected by your app encrypted in transit? | **Yes** (HTTPS) |
| Do you provide a way for users to request that their data is deleted? | **Yes** – qua email trong chính sách (dữ liệu cũng tự xoá sau 90 ngày) |

**Data types** – chỉ khai báo các mục sau, mọi mục khác để trống:

| Nhóm → loại | Collected | Shared | Ephemeral | Required/Optional | Purpose |
| --- | --- | --- | --- | --- | --- |
| App info and performance → **Crash logs** | Yes | No | No | **Optional** (tắt được trong Cài đặt) | **Analytics** |
| App info and performance → **Diagnostics** | Yes | No | No | Optional | Analytics |
| Device or other IDs → **Device or other IDs** (mã cài đặt Firebase/Crashlytics) | Yes | No | No | Optional | Analytics |

Ghi chú khi điền:

- "Shared" = No: Firebase là nhà cung cấp dịch vụ xử lý thay cho nhà phát triển – theo định nghĩa
  của Google, không tính là chia sẻ.
- Sự kiện/ghi chú người dùng **không** khai báo: chỉ lưu trên máy, nhà phát triển không nhận được.
- Sao lưu tự động Android (Auto Backup) do hệ điều hành thực hiện vào tài khoản Google của người
  dùng, nhà phát triển không truy cập được → không tính là thu thập.
- Mục "Analytics" theo định nghĩa của Google bao gồm "monitor app health, diagnose and fix bugs or
  crashes" – đúng mục đích báo cáo lỗi.

## 4. Khai báo quyền USE_EXACT_ALARM

Policy → App content → **Exact alarm permission** (xuất hiện sau khi tải AAB có quyền này lên).

- Chọn chức năng cốt lõi: **Calendar**.
- Mô tả (Google duyệt bằng tiếng Anh – dán nguyên văn):

```
Lich Viet is a Vietnamese lunar/solar calendar app. Its core functionality is calendar
reminders: users save events by lunar or solar date (death anniversaries, birthdays, lunar
1st/15th days) and choose a reminder time (e.g. 07:00) and lead time (same day, 1, 3 or 7 days
before). Each reminder is a user-scheduled, time-critical calendar notification that must fire
at the exact time the user chose, including when the app is closed or the device is idle.
Inexact alarms can be delayed by hours under Doze, which would make reminders arrive late or
on the wrong day. Exact alarms are only scheduled for reminders the user has explicitly set
(at most one per day), never for background work.
```

- Nếu được hỏi video: quay màn hình ~30 giây: tạo sự kiện ngày giỗ → chọn "Nhắc trước 1 ngày" →
  Cài đặt → giờ nhắc 07:00 → "Gửi thông báo thử" → thông báo hiện ra.
- Android 12/12L dùng `SCHEDULE_EXACT_ALARM` (giới hạn `maxSdkVersion=32`), không cần khai báo riêng.

## 5. Quyền khác trong AAB (không cần khai báo, để đối chiếu khi bị hỏi)

| Quyền | Nguồn | Mục đích |
| --- | --- | --- |
| `POST_NOTIFICATIONS` | app / notify-kit | Thông báo nhắc |
| `USE_EXACT_ALARM`, `SCHEDULE_EXACT_ALARM` (≤ API 32) | app | Nhắc đúng giờ |
| `RECEIVE_BOOT_COMPLETED` | notify-kit, background-fetch | Đặt lại lịch nhắc sau khởi động |
| `WAKE_LOCK`, `VIBRATE` | notify-kit / WorkManager | Hiển thị thông báo |
| `INTERNET`, `ACCESS_NETWORK_STATE` | React Native, Firebase | Gửi báo cáo lỗi |

## 6. Phát hành

- Countries/regions: chỉ **Vietnam**.
- Gói tải lên: `android/app/build/outputs/bundle/release/app-release.aab` (`./gradlew bundleRelease`).
- Bật **Play App Signing** (mặc định) – khoá trong `~/.lichviet-signing` là upload key.
- Tài khoản cá nhân tạo sau 11/2023: phải **kiểm thử kín (closed testing) với ≥ 12 người trong 14
  ngày** trước khi được phát hành công khai.
