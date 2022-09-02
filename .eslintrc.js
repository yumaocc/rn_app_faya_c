module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['src/fst'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['off'],
        'react-native/no-inline-styles': ['off'],
        'no-shadow': 'off',
        'no-undef': 'off',
      },
    },
  ],
};
