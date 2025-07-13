import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';

export default [
  {
    ignores: ['dist-react', 'node'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always'],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: { version: 'detect' }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tseslint,
      '@stylistic': stylistic,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      'semi': ['error', 'always'],
      'semi-spacing': ['error', {
        before: false,
        after: true,
      }],
      'semi-style': ['error', 'last'],

      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: 'return',
        },
        {
          blankLine: 'always',
          prev: ['const', 'let', 'var'],
          next: '*',
        },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
        {
          blankLine: 'always',
          prev: 'directive',
          next: '*',
        },
        {
          blankLine: 'any',
          prev: 'directive',
          next: 'directive',
        },
        {
          blankLine: 'always',
          prev: ['case', 'default'],
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: ['if', 'for', 'while', 'switch', 'try'],
        },
        {
          blankLine: 'always',
          prev: ['if', 'for', 'while', 'switch', 'try'],
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'function',
        },
        {
          blankLine: 'always',
          prev: 'function',
          next: '*',
        },
      ],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],
      'comma-spacing': ['error', {
        before: false,
        after: true,
      }],
      'key-spacing': ['error', {
        beforeColon: false,
        afterColon: true,
      }],
      'space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      }],
      'space-in-parens': ['error', 'never'],
      'space-before-blocks': ['error', 'always'],
      'keyword-spacing': ['error', {
        before: true,
        after: true,
      }],
      'brace-style': ['error', '1tbs', { allowSingleLine: false }],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'no-multiple-empty-lines': ['error', {
        max: 2,
        maxEOF: 1,
      }],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],

      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      'no-unused-vars': 'off',

      'eqeqeq': ['error', 'always'],
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'curly': ['error', 'all'],

      'react/no-danger': 'error',
      'react/prop-types': 'off',
      'react/no-unused-prop-types': 'error',
      'react/jsx-uses-vars': 'error',
      'react/require-default-props': 'off',

      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-max-props-per-line': ['error', {
        maximum: 3,
        when: 'multiline'
      }],
      'react/jsx-first-prop-new-line': ['error', 'multiline'],
      'react/jsx-closing-bracket-location': ['error', 'tag-aligned'],
      'react/jsx-closing-tag-location': 'error',
      'react/jsx-tag-spacing': ['error', {
        closingSlash: 'never',
        beforeSelfClosing: 'always',
        afterOpening: 'never',
        beforeClosing: 'never',
      }],
      'react/jsx-curly-spacing': ['error', 'never'],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-pascal-case': 'error',

      '@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 1 }],
      '@stylistic/dot-location': ['error', 'property'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/arrow-spacing': ['error', {
        before: true,
        after: true,
      }],
      '@stylistic/object-curly-newline': ['error', {
        ObjectExpression: {
          multiline: true,
          minProperties: 3,
        },
        ObjectPattern: {
          multiline: true,
          minProperties: 3,
        },
        ImportDeclaration: {
          multiline: true,
          minProperties: 3,
        },
        ExportDeclaration: {
          multiline: true,
          minProperties: 3,
        },
      }],
      '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
      '@stylistic/array-element-newline': ['error', {
        ArrayExpression: 'consistent',
        ArrayPattern: { minItems: 3 },
      }],
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],
      '@stylistic/template-curly-spacing': ['error', 'never'],
      '@stylistic/operator-linebreak': ['error', 'before'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/comma-spacing': ['error', {
        before: false,
        after: true,
      }],
    },
  },
];
