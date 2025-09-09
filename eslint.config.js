module.exports = [
  {
    ignores: ['node_modules', 'dist', 'build'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: require('@typescript-eslint/parser'), // 👈 tell ESLint to parse TS
    },
    plugins: {
      react: require('eslint-plugin-react'),
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      'unused-imports': require('eslint-plugin-unused-imports'),
    },
    rules: {
      // base JS rules
      'no-unused-vars': 'warn',

      // unused import cleanup
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],

      // recommended TS rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
    },
  },
];
