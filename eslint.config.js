module.exports = [
    {
      ignores: ['node_modules', 'dist', 'build'],
    },
    {
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      plugins: {
        react: require('eslint-plugin-react'),
        'unused-imports': require('eslint-plugin-unused-imports'),
      },
      rules: {
        'no-unused-vars': 'warn',
        'unused-imports/no-unused-imports': 'error',
      },
    },
  ];
  