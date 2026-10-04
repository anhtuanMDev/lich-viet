module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'react-hooks/exhaustive-deps': 'error',
    'react-native/no-inline-styles': 'error',
  },
  overrides: [
    {
      // Script Node chạy ngoài app (sinh icon…).
      files: ['scripts/**/*.js'],
      env: { node: true },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/consistent-type-imports': 'error',
        // Cho phép `const X = memo(function X() {})` - giữ tên component trong DevTools.
        '@typescript-eslint/no-shadow': ['warn', { ignoreOnInitialization: true }],
      },
    },
    {
      // Widget Android không phải RN view: không có StyleSheet, style phải viết trực tiếp.
      files: ['src/features/widget/android/**/*.tsx'],
      rules: {
        'react-native/no-inline-styles': 'off',
      },
    },
    {
      // core/ là logic thuần (không phụ thuộc React/RN) để test được và dùng lại cho widget.
      files: ['src/core/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              'react',
              'react-native',
              'react-native-*',
              '@react-*/*',
              '@features/*',
              '@shared/*',
              '@app/*',
            ],
          },
        ],
      },
    },
  ],
};
