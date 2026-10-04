#!/usr/bin/env bash
# Thay script "[RNFB] Crashlytics Configuration" (khai báo trong react-native.config.js):
# chưa thêm GoogleService-Info.plist → bỏ qua thay vì làm hỏng build;
# có file → chạy script gốc (ghi cấu hình + tải dSYM để giải mã stack trace).
set -e

PLIST="${BUILT_PRODUCTS_DIR}/${UNLOCALIZED_RESOURCES_FOLDER_PATH}/GoogleService-Info.plist"
if [[ ! -f "${PLIST}" ]]; then
  echo "warning: Chưa có GoogleService-Info.plist trong app - bỏ qua Crashlytics (không gửi báo cáo lỗi)."
  exit 0
fi

exec "${PODS_ROOT}/../../node_modules/@react-native-firebase/crashlytics/ios_config.sh"
