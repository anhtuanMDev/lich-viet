const path = require('path');

// Đường dẫn scriptPhases được tính tương đối từ thư mục của package.
const fromPackage = (pkg, file) =>
  path.relative(
    path.dirname(require.resolve(`${pkg}/package.json`)),
    path.join(__dirname, file),
  );

module.exports = {
  dependencies: {
    '@react-native-firebase/crashlytics': {
      platforms: {
        ios: {
          // Bỏ qua bước Crashlytics khi chưa có GoogleService-Info.plist – xem script.
          scriptPhases: [
            {
              name: '[RNFB] Crashlytics Configuration',
              path: fromPackage(
                '@react-native-firebase/crashlytics',
                'scripts/ios-crashlytics-phase.sh',
              ),
              execution_position: 'after_compile',
              input_files: [
                '${DWARF_DSYM_FOLDER_PATH}/${DWARF_DSYM_FILE_NAME}/Contents/Resources/DWARF/${TARGET_NAME}',
                '$(BUILT_PRODUCTS_DIR)/$(INFOPLIST_PATH)',
              ],
            },
          ],
        },
      },
    },
  },
};
