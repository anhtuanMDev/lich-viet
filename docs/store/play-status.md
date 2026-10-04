# Trạng thái Google Play - sổ theo dõi

File này là "sổ tay" của người quản lý store: trạng thái hiện tại, việc còn tồn, lịch sử phát hành.
Cập nhật mỗi khi có thay đổi trên Play Console. Khai báo chi tiết (Data safety, quyền…) nằm ở
`google-play.md`, nội dung trang ứng dụng ở `listing.md`.

## Thông tin cố định

| Mục | Giá trị |
| --- | --- |
| Tên trên Play | Lịch Việt - Âm lịch, Ngày giỗ |
| Package | `com.lichviet.app` (không đổi được sau khi tải lên) |
| Firebase | project `lich-viet-32e72` (Crashlytics) |
| SDK | min 24 · target 36 · compile 37 |
| Ký app | Play App Signing; upload key ở `~/.lichviet-signing/upload-keystore.jks` |
| Quốc gia | chỉ Việt Nam · miễn phí · không quảng cáo, không IAP |
| Danh mục | Năng suất (Productivity) |
| Chính sách quyền riêng tư | https://portfolio-three-theta-41.vercel.app/lich-viet/privacy-policy/ (repo `portfolio`, Vercel) |
| Nhà phát triển / email | Alex Vin · anhtuan03.MDev@gmail.com |
| Trang web (Store settings) | https://portfolio-three-theta-41.vercel.app/lich-viet/ (repo `portfolio`, `src/pages/lich-viet/index.tsx`; lên production → đặt `IS_PUBLIC = true`) |

## Trạng thái hiện tại (cập nhật 2026-10-04)

| Hạng mục | Trạng thái |
| --- | --- |
| Bản build mới nhất | 1.0.0 (versionCode 1) - `releases/1.0.0/lichviet-1.0.0-1-20261004-112211.aab` |
| Phiên bản tiếp theo | 1.0.1 (versionCode 2) - đã tăng version, **chưa build/tải lên**. Ghi chú: `release-notes/1.0.1.txt` |
| Đã tải lên Play Console? | ✅ 2026-10-04 |
| Track | Internal testing |
| Closed testing 12 người × 14 ngày | Dự kiến tính từ 2026-10-04 - **chỉ được tính khi bản build nằm ở track Closed testing** (track Internal không tính). Sớm nhất đủ điều kiện xin production: 2026-10-18 |

## Việc còn tồn (chặn phát hành)

- [ ] Cập nhật link chính sách trên Play Console (App content → Privacy policy) thành
      `https://portfolio-three-theta-41.vercel.app/lich-viet/privacy-policy/`. Bản 1.0.0 trong app vẫn trỏ
      link GitHub Pages cũ (404) - link mới có từ bản build sau.
- [ ] Điền email hỗ trợ `anhtuan03.MDev@gmail.com` ở Store settings → Store contact details.
- [ ] Chưa có ảnh chụp màn hình (tối thiểu 2 ảnh điện thoại). Gợi ý trong `listing.md`.
- [ ] Đưa bản 1.0.0 sang track **Closed testing** và mời ≥ 12 người (họ phải opt-in và giữ app suốt 14 ngày).
- [ ] Khai báo USE_EXACT_ALARM (mục "Calendar") sau khi tải AAB lên - nội dung có sẵn ở `google-play.md` §4.

## Quy ước để quản lý về sau

- **Mỗi bản tải lên Play = một tag có chú thích** `v<versionName>` đặt trên đúng commit đã build,
  nội dung tag ghi versionCode và track, ví dụ: `git tag -a v1.0.1 -m "Lịch Việt 1.0.1 (versionCode 2) - internal"`.
  Lên track mới (internal → closed → production) thì ghi vào bảng Lịch sử bên dưới, không tạo tag mới.
- Commit liên quan store/Play Console dùng scope `store`: `docs(store): …`, `chore(store): …`.
- Build: `npm run bundle` → file AAB nằm trong `releases/<versionName>/`. Trước đó tăng `versionCode`
  và `versionName` trong `android/app/build.gradle`.
- Đổi quyền / SDK / dữ liệu thu thập → cập nhật `google-play.md`, `docs/privacy-policy.md` và khai báo lại trên Console.

## Lịch sử phát hành

| Ngày | Phiên bản | versionCode | Track | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| 2026-10-04 | 1.0.0 | 1 | - | Đã build AAB | Tag `v1.0.0` → commit `663af5b` |
| 2026-10-04 | 1.0.0 | 1 | Internal | Đã tải lên | |
| 2026-10-04 | 1.0.1 | 2 | - | Đã tăng version | Sửa link chính sách trong Cài đặt, đổi dấu gạch. Gắn tag `v1.0.1` khi tải lên Play |
