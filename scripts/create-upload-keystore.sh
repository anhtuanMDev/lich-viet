#!/usr/bin/env bash
# Tạo khoá upload để ký bản release Android (dùng với Play App Signing).
#
# - Khoá lưu NGOÀI repo: ~/.lichviet-signing/upload-keystore.jks
# - Mật khẩu ngẫu nhiên, ghi vào ~/.gradle/gradle.properties (build.gradle đọc từ đó),
#   không in ra màn hình.
# - Không bao giờ ghi đè khoá đã có: mất khoá cũ = phải xin Google đặt lại khoá upload.
#
# SAU KHI CHẠY: sao lưu thư mục ~/.lichviet-signing và các dòng LICHVIET_UPLOAD_* trong
# ~/.gradle/gradle.properties vào trình quản lý mật khẩu (1Password, Bitwarden…).
set -euo pipefail

SIGNING_DIR="${HOME}/.lichviet-signing"
KEYSTORE="${SIGNING_DIR}/upload-keystore.jks"
GRADLE_PROPS="${HOME}/.gradle/gradle.properties"
ALIAS="lichviet-upload"

if [[ -e "${KEYSTORE}" ]]; then
  echo "Đã có khoá tại ${KEYSTORE} - không tạo lại để tránh mất khoá cũ." >&2
  exit 1
fi
if [[ -f "${GRADLE_PROPS}" ]] && grep -q '^LICHVIET_UPLOAD_' "${GRADLE_PROPS}"; then
  echo "${GRADLE_PROPS} đã có cấu hình LICHVIET_UPLOAD_* - kiểm tra lại trước khi tạo khoá mới." >&2
  exit 1
fi
command -v keytool >/dev/null || { echo "Không tìm thấy keytool (cần JDK 17)." >&2; exit 1; }

mkdir -p "${SIGNING_DIR}" "$(dirname "${GRADLE_PROPS}")"
chmod 700 "${SIGNING_DIR}"

# PKCS12 dùng chung một mật khẩu cho kho khoá và khoá.
command -v openssl >/dev/null || { echo "Không tìm thấy openssl." >&2; exit 1; }
# 24 byte ngẫu nhiên → 48 ký tự hex (không dùng pipe để tránh SIGPIPE với pipefail).
PASSWORD="$(openssl rand -hex 24)"

keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore "${KEYSTORE}" \
  -alias "${ALIAS}" \
  -keyalg RSA -keysize 4096 \
  -validity 10000 \
  -storepass "${PASSWORD}" -keypass "${PASSWORD}" \
  -dname "CN=Lich Viet, O=Lich Viet, C=VN" >/dev/null 2>&1
chmod 600 "${KEYSTORE}"

touch "${GRADLE_PROPS}"
chmod 600 "${GRADLE_PROPS}"
{
  echo ""
  echo "# Lịch Việt - khoá upload ký bản release (tạo $(date +%Y-%m-%d))"
  echo "LICHVIET_UPLOAD_STORE_FILE=${KEYSTORE}"
  echo "LICHVIET_UPLOAD_STORE_PASSWORD=${PASSWORD}"
  echo "LICHVIET_UPLOAD_KEY_ALIAS=${ALIAS}"
  echo "LICHVIET_UPLOAD_KEY_PASSWORD=${PASSWORD}"
} >>"${GRADLE_PROPS}"
unset PASSWORD

echo "Đã tạo khoá upload: ${KEYSTORE}"
echo "Cấu hình ký đã ghi vào: ${GRADLE_PROPS}"
echo
echo "Dấu vân tay SHA-256 (dùng khi đăng ký với Google Play nếu cần):"
keytool -list -v -keystore "${KEYSTORE}" -alias "${ALIAS}" \
  -storepass "$(grep '^LICHVIET_UPLOAD_STORE_PASSWORD=' "${GRADLE_PROPS}" | cut -d= -f2-)" \
  2>/dev/null | grep 'SHA256:'
echo
echo "QUAN TRỌNG: sao lưu ${SIGNING_DIR} và các dòng LICHVIET_UPLOAD_* trong ${GRADLE_PROPS}"
echo "vào trình quản lý mật khẩu. Không commit chúng vào git."
