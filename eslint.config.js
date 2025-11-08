import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import boundariesPlugin from 'eslint-plugin-boundaries';
import unicornPlugin from 'eslint-plugin-unicorn';
import prettierConfig from 'eslint-config-prettier';

export default [
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    ignores: ['dist/**/*', 'node_modules/**/*', '**/*.md', '**/*.svg'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/main.tsx', '**/*.styles.ts', '**/*.styles.tsx', 'src/*.d.ts'],
    plugins: {
      import: importPlugin,
      boundaries: boundariesPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        // 타입 정보가 필요한 규칙을 사용하므로 project 옵션 유지
        // 단, 스타일 파일은 제외
        project: ['./tsconfig.app.json'],
      },
      globals: {
        console: true,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.app.json',
        },
      },
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'pages', pattern: 'src/pages/**' },
        { type: 'widgets', pattern: 'src/widgets/**' },
        { type: 'features', pattern: 'src/features/**' },
        { type: 'entities', pattern: 'src/entities/**' },
        { type: 'shared', pattern: 'src/shared/**' },
      ],
      'boundaries/include': ['src/**/*'],
    },
    rules: {
      ...js.configs.recommended.rules,
      eqeqeq: 'error',
      'no-var': 'error',
      'no-empty-pattern': 'error',
      'no-undef': 'off',
      'import/no-default-export': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          args: 'none',
        },
      ],
      'prefer-const': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      // TypeScript 타입 체크 강화
      // 타입 정보가 필요한 규칙이지만, 타입 에러가 있어도 ESLint가 실패하지 않도록 warn으로 설정
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      // FSD Boundaries 규칙: 레이어 간 import 규칙 강제
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: ['app'],
              allow: ['pages', 'widgets', 'features', 'entities', 'shared'],
            },
            {
              from: ['pages'],
              allow: ['widgets', 'features', 'entities', 'shared'],
            },
            {
              from: ['widgets'],
              allow: ['features', 'entities', 'shared'],
            },
            {
              from: ['features'],
              allow: ['entities', 'shared'],
            },
            {
              from: ['entities'],
              allow: ['shared'],
            },
            {
              from: ['shared'],
              allow: [],
            },
          ],
        },
      ],
    },
  },
  // 스타일 파일에 대한 특별 규칙
  {
    files: ['**/*.styles.ts', '**/*.styles.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        // 타입 정보가 필요한 규칙을 사용하지 않으므로 project 옵션 제거
        // 타입 체크는 TypeScript 컴파일러가 담당
      },
    },
    rules: {
      // 스타일 파일에서는 타입 정보가 필요한 규칙 비활성화
      // 타입 에러는 TypeScript 컴파일러가 체크하므로 ESLint에서 중복 체크 불필요
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
  // shared/ui 내부에서 styles 파일은 같은 디렉토리에서만 import 가능
  {
    files: ['src/shared/ui/**/*.{ts,tsx}'],
    ignores: ['**/index.{ts,tsx}', '**/*.styles.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '../**/*.styles',
                '../**/*.styles.ts',
                '@/shared/ui/**/*.styles',
                '@/shared/ui/**/*.styles.ts',
              ],
              message:
                '❌ Style files should only be imported within their component directory using relative imports (e.g., "./ComponentName.styles"). Do not import styles from other components.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['**/index.{ts,tsx}', 'src/main.tsx', 'src/App.tsx', 'src/shared/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../**/*.styles', '../**/*.styles.ts', '@/**/*.styles', '@/**/*.styles.ts'],
              message:
                '❌ Style files should only be imported within their component directory using relative imports (e.g., "./ComponentName.styles"). Do not import styles from other components.',
            },
            {
              group: ['..', '../*', '../**/*'],
              message: 'Please use absolute imports with @/ instead of relative paths with ../.',
            },
            {
              group: ['@/features/**/**/*', '!@/features/**/**/index', '!@/features/**'],
              message:
                'Please import from the barrel file (index.ts) of the respective feature directory instead.',
            },
            {
              group: ['@/assets/icons/*', '!@/assets/icons'],
              message: 'Please import from the barrel file (@/assets/icons) instead.',
            },
            {
              group: ['@/assets/images/*', '!@/assets/images'],
              message: 'Please import from the barrel file (@/assets/images) instead.',
            },
            {
              group: ['@/assets/fonts/*', '!@/assets/fonts'],
              message: 'Please import from the barrel file (@/assets/fonts) instead.',
            },
            {
              group: [
                '@/shared/components/*/*',
                '!@/shared/components/*/index',
                '!@/shared/components/index',
              ],
              message:
                'Please import from the respective component directory barrel file (index.ts).',
            },
            {
              group: [
                '@/shared/layout/*/*/*/*',
                '!@/shared/layout/*/*/*/index',
                '!@/shared/layout/*/*/index',
                '!@/shared/layout/*/index',
                '!@/shared/layout/index',
              ],
              message: 'Please import from the barrel file (@/shared/layout/*/*/index) instead.',
            },
            {
              group: ['@/shared/hooks/*', '!@/shared/hooks'],
              message: 'Please import from the barrel file (@/shared/hooks) instead.',
            },
            {
              group: ['@/shared/utils/*', '!@/shared/utils'],
              message: 'Please import from the barrel file (@/shared/utils) instead.',
            },
            {
              group: ['@/shared/api/*', '!@/shared/api'],
              message: 'Please import from the barrel file (@/shared/api) instead.',
            },
            {
              group: ['@/shared/types/*', '!@/shared/types'],
              message: 'Please import from the barrel file (@/shared/types) instead.',
            },
            {
              group: ['@/shared/store/*', '!@/shared/store'],
              message: 'Please import from the barrel file (@/shared/store) instead.',
            },
            {
              group: ['@/shared/queries/*', '!@/shared/queries'],
              message: 'Please import from the barrel file (@/shared/queries) instead.',
            },
            // FSD Public API 규칙: Entities - 내부 세그먼트에 직접 접근 불가
            {
              group: [
                '@/entities/**/*/ui/**',
                '@/entities/**/*/api/**',
                '@/entities/**/*/model/**',
                '@/entities/**/*/lib/**',
                '!@/entities/**/index',
                '!@/entities/**',
              ],
              message:
                '❌ FSD Public API: Please import from the slice barrel file (e.g., @/entities/user) instead of accessing internal segments directly.',
            },
            // FSD Public API 규칙: Entities queries 파일에서 같은 세그먼트의 api 파일 직접 접근 불가
            {
              group: [
                './*.api',
                './*.api.ts',
                '@/entities/**/api/*.api',
                '@/entities/**/api/*.api.ts',
              ],
              message:
                '❌ FSD Public API: Please import API functions from the slice barrel file (e.g., @/entities/post) instead of accessing api files directly.',
            },
            // FSD Public API 규칙: Features - 내부 세그먼트에 직접 접근 불가
            {
              group: [
                '@/features/**/*/ui/**',
                '@/features/**/*/model/**',
                '@/features/**/*/api/**',
                '@/features/**/*/lib/**',
                '!@/features/**/index',
                '!@/features/**',
              ],
              message:
                '❌ FSD Public API: Please import from the feature slice barrel file (e.g., @/features/post/post-list) instead of accessing internal segments directly.',
            },
            // FSD Public API 규칙: Widgets - 내부 세그먼트에 직접 접근 불가
            {
              group: [
                '@/widgets/**/*/ui/**',
                '@/widgets/**/*/model/**',
                '@/widgets/**/*/api/**',
                '@/widgets/**/*/lib/**',
                '!@/widgets/**/index',
                '!@/widgets/**',
              ],
              message:
                '❌ FSD Public API: Please import from the widget slice barrel file (e.g., @/widgets/header) instead of accessing internal segments directly.',
            },
            // FSD Public API 규칙: Shared UI - barrel file 사용 금지, 개별 컴포넌트에서 import
            {
              group: ['@/shared/ui$', '@/shared/ui/index'],
              message:
                '❌ FSD Public API: Please import from individual component directories (e.g., @/shared/ui/Button) instead of the barrel file (@/shared/ui).',
            },
            // FSD Public API 규칙: Pages - 내부 컴포넌트에 직접 접근 불가 (슬라이스 레벨 index.ts 통해서만)
            {
              group: [
                '@/pages/**/*/*',
                '@/pages/**/*/*/*',
                '!@/pages/**/index',
                '!@/pages/index',
                '!@/pages',
              ],
              message:
                '❌ FSD Public API: Please import from the barrel file (@/pages) instead of accessing page components directly.',
            },
          ],
        },
      ],
    },
  },
  // 파일 명명 규칙 (unicorn/filename-case)
  // 비-ASCII 문자 검사 (한글 등) - 커스텀 규칙
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['**/index.{ts,tsx}'],
    plugins: {
      'custom-filename': {
        rules: {
          'no-non-ascii-filename': {
            meta: {
              type: 'problem',
              docs: {
                description: '파일명에 비-ASCII 문자 사용 금지',
              },
              messages: {
                nonAscii:
                  '파일명 "{{filename}}"에 비-ASCII 문자가 포함되어 있습니다. ASCII 문자만 사용해주세요.',
              },
            },
            create(context) {
              return {
                Program(node) {
                  const filename = context.getFilename();
                  const basename = filename.split('/').pop() || '';
                  // 확장자 제거
                  const nameWithoutExt = basename.replace(/\.(ts|tsx|js|jsx)$/, '');
                  // 비-ASCII 문자 검사 (한글, 한자, 일본어 등)
                  const nonAsciiRegex = /[^\x00-\x7F]/;
                  if (nonAsciiRegex.test(nameWithoutExt)) {
                    context.report({
                      node,
                      messageId: 'nonAscii',
                      data: {
                        filename: basename,
                      },
                    });
                  }
                },
              };
            },
          },
        },
      },
    },
    rules: {
      'custom-filename/no-non-ascii-filename': 'error',
    },
  },
  // 컴포넌트 파일: PascalCase
  {
    files: ['src/**/*.tsx'],
    ignores: [
      'src/main.tsx',
      'src/App.tsx',
      '**/index.tsx',
      '**/FSD*.tsx',
      '**/UI*.tsx', // UI 약어 허용
    ],
    plugins: {
      unicorn: unicornPlugin,
    },
    rules: {
      'unicorn/filename-case': ['error', { case: 'pascalCase' }],
    },
  },
  // 스타일 파일: PascalCase.styles.ts
  {
    files: ['src/**/*.styles.ts'],
    ignores: ['**/FSD*.styles.ts', '**/UI*.styles.ts'], // FSD, UI 약어 허용
    plugins: {
      unicorn: unicornPlugin,
    },
    rules: {
      'unicorn/filename-case': ['error', { case: 'pascalCase' }],
    },
  },
  // 유틸리티 파일: kebab-case (common.util.ts, date.util.ts 등)
  {
    files: ['src/**/utils/**/*.ts'],
    ignores: ['**/index.ts', '**/fsd-scanner.ts'],
    plugins: {
      unicorn: unicornPlugin,
    },
    rules: {
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    },
  },

  // API 파일: kebab-case.api.ts
  {
    files: ['src/**/*.api.ts'],
    plugins: {
      unicorn: unicornPlugin,
    },
    rules: {
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    },
  },
  // Queries 파일: kebab-case.queries.ts
  {
    files: ['src/**/*.queries.ts'],
    plugins: {
      unicorn: unicornPlugin,
    },
    rules: {
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    },
  },
  // 타입 파일: camelCase (shared/types 폴더)
  {
    files: ['src/**/types/**/*.ts'],
    ignores: ['**/index.ts'],
    plugins: {
      unicorn: unicornPlugin,
    },
    rules: {
      'unicorn/filename-case': ['error', { case: 'camelCase' }],
    },
  },
  // 타입 파일: 소문자 (model/types.ts)
  {
    files: ['src/**/model/**/types.ts'],
    plugins: {
      unicorn: unicornPlugin,
    },
    rules: {
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    },
  },
  // 설정 파일: camelCase (config 폴더)
  {
    files: ['src/**/config/**/*.ts'],
    ignores: ['**/index.ts'],
    plugins: {
      unicorn: unicornPlugin,
    },
    rules: {
      'unicorn/filename-case': ['error', { case: 'camelCase' }],
    },
  },
  // index.ts 파일은 예외 처리
  {
    files: ['**/index.{ts,tsx}'],
    plugins: {
      unicorn: unicornPlugin,
    },
    rules: {
      'unicorn/filename-case': 'off',
    },
  },
  // SVG 파일: kebab-case (unicorn은 SVG 파일 파싱 불가하므로 주석 처리)
  // {
  //   files: ['src/**/*.svg'],
  //   plugins: {
  //     unicorn: unicornPlugin,
  //   },
  //   rules: {
  //     'unicorn/filename-case': ['error', { case: 'kebabCase' }],
  //   },
  // },
  // MD 파일: SCREAMING_SNAKE_CASE (unicorn은 MD 파일 파싱 불가하므로 주석 처리)
  // {
  //   files: ['**/*.md'],
  //   ignores: ['README.md', 'CHANGELOG.md'],
  //   plugins: {
  //     unicorn: unicornPlugin,
  //   },
  //   rules: {
  //     'unicorn/filename-case': [
  //       'error',
  //       {
  //         case: 'kebabCase',
  //       },
  //     ],
  //   },
  // },
];
