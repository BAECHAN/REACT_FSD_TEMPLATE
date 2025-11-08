/**
 * FSD 구조 스캐너
 * 실제 프로젝트의 FSD 레이어 구조를 스캔하여 반환합니다.
 */

export interface FSDItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FSDItem[];
  layer: 'app' | 'pages' | 'widgets' | 'features' | 'entities' | 'shared';
}

export interface FSDLayer {
  name: 'app' | 'pages' | 'widgets' | 'features' | 'entities' | 'shared';
  description: string;
  color: string;
  items: FSDItem[];
}

const LAYER_CONFIG: Record<string, { description: string; color: string }> = {
  app: {
    description: '애플리케이션 초기화, 프로바이더, 라우팅',
    color: '#6366f1',
  },
  pages: {
    description: '페이지 컴포넌트 (라우트)',
    color: '#8b5cf6',
  },
  widgets: {
    description: '복잡한 UI 블록 (여러 feature 조합)',
    color: '#ec4899',
  },
  features: {
    description: '비즈니스 기능 (사용자 액션)',
    color: '#f59e0b',
  },
  entities: {
    description: '도메인 모델 (Post, User 등)',
    color: '#10b981',
  },
  shared: {
    description: '공통 코드 (UI 컴포넌트, 유틸리티, API 설정)',
    color: '#6b7280',
  },
};

/**
 * 파일 경로를 파싱하여 FSD 구조를 생성합니다.
 */
function parsePathToFSD(path: string): {
  layer: string;
  segments: string[];
} | null {
  // src/ 이후의 경로를 추출
  const match = path.match(/^src\/(app|pages|widgets|features|entities|shared)\/(.+)$/);
  if (!match || match.length < 3) return null;

  const layer = match[1];
  const rest = match[2];
  if (!layer || !rest) return null;

  const segments = rest.split('/').filter(Boolean);

  return { layer, segments };
}

/**
 * 파일 경로 목록을 FSD 트리 구조로 변환합니다.
 */
export function scanFSDStructure(): FSDLayer[] {
  // Vite의 import.meta.glob을 사용하여 모든 파일을 가져옵니다
  // 실제로는 빌드 타임에 이 정보를 생성해야 하지만,
  // 여기서는 동적으로 스캔하는 방식으로 구현합니다

  const layers: Record<string, Map<string, FSDItem>> = {
    app: new Map(),
    pages: new Map(),
    widgets: new Map(),
    features: new Map(),
    entities: new Map(),
    shared: new Map(),
  };

  // 모든 파일을 가져옵니다 (import.meta.glob 사용)
  const modules = import.meta.glob('/src/**/*.{ts,tsx}', { eager: false });

  Object.keys(modules).forEach((path) => {
    const parsed = parsePathToFSD(path);
    if (!parsed) return;

    const { layer, segments } = parsed;
    if (!layers[layer]) return;

    // 트리 구조 생성
    let currentMap = layers[layer];
    let currentPath = '';

    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1;
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;

      if (!currentMap.has(currentPath)) {
        currentMap.set(currentPath, {
          name: segment,
          path: `src/${layer}/${currentPath}`,
          type: isLast ? 'file' : 'directory',
          layer: layer as FSDItem['layer'],
          children: isLast ? undefined : [],
        });
      }

      const item = currentMap.get(currentPath)!;
      if (!isLast && item.children) {
        // 다음 레벨을 위한 새로운 Map 생성
        const childMap = new Map<string, FSDItem>();
        item.children.forEach((child) => {
          childMap.set(child.name, child);
        });
        currentMap = childMap;
      }
    });
  });

  // Map을 배열로 변환하고 정렬
  const result: FSDLayer[] = Object.entries(layers).map(([layerName, itemsMap]) => {
    const items = Array.from(itemsMap.values())
      .filter((item) => {
        // 최상위 레벨 아이템만 반환 (중복 제거)
        const pathParts = item.path.split('/');
        return pathParts.length <= 3 || (pathParts.length === 4 && item.type === 'file');
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      name: layerName as FSDLayer['name'],
      description: LAYER_CONFIG[layerName]?.description || '',
      color: LAYER_CONFIG[layerName]?.color || '#000000',
      items,
    };
  });

  return result;
}

/**
 * 실제 파일 시스템을 기반으로 FSD 구조를 스캔합니다.
 * 이 함수는 정적으로 정의된 프로젝트 구조를 반환합니다.
 */
export function getFSDStructure(): FSDLayer[] {
  return [
    {
      name: 'app',
      description: '애플리케이션 초기화, 프로바이더, 라우팅',
      color: '#6366f1',
      items: [
        {
          name: 'App.tsx',
          path: 'src/app/App.tsx',
          type: 'file',
          layer: 'app',
        },
        {
          name: 'providers',
          path: 'src/app/providers',
          type: 'directory',
          layer: 'app',
          children: [
            {
              name: 'QueryProvider.tsx',
              path: 'src/app/providers/QueryProvider.tsx',
              type: 'file',
              layer: 'app',
            },
            {
              name: 'RouterProvider.tsx',
              path: 'src/app/providers/RouterProvider.tsx',
              type: 'file',
              layer: 'app',
            },
            {
              name: 'ThemeProvider.tsx',
              path: 'src/app/providers/ThemeProvider.tsx',
              type: 'file',
              layer: 'app',
            },
          ],
        },
        {
          name: 'routes',
          path: 'src/app/routes',
          type: 'directory',
          layer: 'app',
          children: [
            { name: 'index.tsx', path: 'src/app/routes/index.tsx', type: 'file', layer: 'app' },
          ],
        },
      ],
    },
    {
      name: 'pages',
      description: '페이지 컴포넌트 (라우트)',
      color: '#8b5cf6',
      items: [
        {
          name: 'home',
          path: 'src/pages/home',
          type: 'directory',
          layer: 'pages',
          children: [
            {
              name: 'HomePage',
              path: 'src/pages/home/HomePage',
              type: 'directory',
              layer: 'pages',
              children: [
                {
                  name: 'HomePage.tsx',
                  path: 'src/pages/home/HomePage/HomePage.tsx',
                  type: 'file',
                  layer: 'pages',
                },
                {
                  name: 'HomePage.styles.ts',
                  path: 'src/pages/home/HomePage/HomePage.styles.ts',
                  type: 'file',
                  layer: 'pages',
                },
              ],
            },
          ],
        },
        {
          name: 'post',
          path: 'src/pages/post',
          type: 'directory',
          layer: 'pages',
          children: [
            {
              name: 'PostListPage',
              path: 'src/pages/post/PostListPage',
              type: 'directory',
              layer: 'pages',
              children: [
                {
                  name: 'PostListPage.tsx',
                  path: 'src/pages/post/PostListPage/PostListPage.tsx',
                  type: 'file',
                  layer: 'pages',
                },
                {
                  name: 'PostListPage.styles.ts',
                  path: 'src/pages/post/PostListPage/PostListPage.styles.ts',
                  type: 'file',
                  layer: 'pages',
                },
              ],
            },
            {
              name: 'CreatePostPage',
              path: 'src/pages/post/CreatePostPage',
              type: 'directory',
              layer: 'pages',
              children: [
                {
                  name: 'CreatePostPage.tsx',
                  path: 'src/pages/post/CreatePostPage/CreatePostPage.tsx',
                  type: 'file',
                  layer: 'pages',
                },
              ],
            },
          ],
        },
        {
          name: 'user',
          path: 'src/pages/user',
          type: 'directory',
          layer: 'pages',
          children: [
            {
              name: 'UserListPage',
              path: 'src/pages/user/UserListPage',
              type: 'directory',
              layer: 'pages',
              children: [
                {
                  name: 'UserListPage.tsx',
                  path: 'src/pages/user/UserListPage/UserListPage.tsx',
                  type: 'file',
                  layer: 'pages',
                },
              ],
            },
          ],
        },
        {
          name: 'architecture',
          path: 'src/pages/architecture',
          type: 'directory',
          layer: 'pages',
          children: [
            {
              name: 'ArchitecturePage',
              path: 'src/pages/architecture/ArchitecturePage',
              type: 'directory',
              layer: 'pages',
              children: [
                {
                  name: 'ArchitecturePage.tsx',
                  path: 'src/pages/architecture/ArchitecturePage/ArchitecturePage.tsx',
                  type: 'file',
                  layer: 'pages',
                },
                {
                  name: 'ArchitecturePage.styles.ts',
                  path: 'src/pages/architecture/ArchitecturePage/ArchitecturePage.styles.ts',
                  type: 'file',
                  layer: 'pages',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'widgets',
      description: '복잡한 UI 블록 (여러 feature 조합)',
      color: '#ec4899',
      items: [
        {
          name: 'header',
          path: 'src/widgets/header',
          type: 'directory',
          layer: 'widgets',
          children: [
            {
              name: 'Header',
              path: 'src/widgets/header/ui/Header',
              type: 'directory',
              layer: 'widgets',
              children: [
                {
                  name: 'Header.tsx',
                  path: 'src/widgets/header/ui/Header/Header.tsx',
                  type: 'file',
                  layer: 'widgets',
                },
                {
                  name: 'Header.styles.ts',
                  path: 'src/widgets/header/ui/Header/Header.styles.ts',
                  type: 'file',
                  layer: 'widgets',
                },
              ],
            },
          ],
        },
        {
          name: 'page-layout',
          path: 'src/widgets/page-layout',
          type: 'directory',
          layer: 'widgets',
          children: [
            {
              name: 'PageLayout',
              path: 'src/widgets/page-layout/ui/PageLayout',
              type: 'directory',
              layer: 'widgets',
              children: [
                {
                  name: 'PageLayout.tsx',
                  path: 'src/widgets/page-layout/ui/PageLayout/PageLayout.tsx',
                  type: 'file',
                  layer: 'widgets',
                },
                {
                  name: 'PageLayout.styles.ts',
                  path: 'src/widgets/page-layout/ui/PageLayout/PageLayout.styles.ts',
                  type: 'file',
                  layer: 'widgets',
                },
              ],
            },
          ],
        },
        {
          name: 'date-format-demo',
          path: 'src/widgets/date-format-demo',
          type: 'directory',
          layer: 'widgets',
          children: [
            {
              name: 'DateFormatDemo',
              path: 'src/widgets/date-format-demo/ui/DateFormatDemo',
              type: 'directory',
              layer: 'widgets',
              children: [
                {
                  name: 'DateFormatDemo.tsx',
                  path: 'src/widgets/date-format-demo/ui/DateFormatDemo/DateFormatDemo.tsx',
                  type: 'file',
                  layer: 'widgets',
                },
                {
                  name: 'DateFormatDemo.styles.ts',
                  path: 'src/widgets/date-format-demo/ui/DateFormatDemo/DateFormatDemo.styles.ts',
                  type: 'file',
                  layer: 'widgets',
                },
              ],
            },
            {
              name: 'DateFormatExample',
              path: 'src/widgets/date-format-demo/ui/DateFormatExample',
              type: 'directory',
              layer: 'widgets',
              children: [
                {
                  name: 'DateFormatExample.tsx',
                  path: 'src/widgets/date-format-demo/ui/DateFormatExample/DateFormatExample.tsx',
                  type: 'file',
                  layer: 'widgets',
                },
                {
                  name: 'DateFormatExample.styles.ts',
                  path: 'src/widgets/date-format-demo/ui/DateFormatExample/DateFormatExample.styles.ts',
                  type: 'file',
                  layer: 'widgets',
                },
              ],
            },
          ],
        },
        {
          name: 'assets-demo',
          path: 'src/widgets/assets-demo',
          type: 'directory',
          layer: 'widgets',
          children: [
            {
              name: 'AssetsDemo',
              path: 'src/widgets/assets-demo/ui/AssetsDemo',
              type: 'directory',
              layer: 'widgets',
              children: [
                {
                  name: 'AssetsDemo.tsx',
                  path: 'src/widgets/assets-demo/ui/AssetsDemo/AssetsDemo.tsx',
                  type: 'file',
                  layer: 'widgets',
                },
                {
                  name: 'AssetsDemo.styles.ts',
                  path: 'src/widgets/assets-demo/ui/AssetsDemo/AssetsDemo.styles.ts',
                  type: 'file',
                  layer: 'widgets',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'features',
      description: '비즈니스 기능 (사용자 액션)',
      color: '#f59e0b',
      items: [
        {
          name: 'post',
          path: 'src/features/post',
          type: 'directory',
          layer: 'features',
          children: [
            {
              name: 'post-list',
              path: 'src/features/post/post-list',
              type: 'directory',
              layer: 'features',
              children: [
                {
                  name: 'PostList',
                  path: 'src/features/post/post-list/ui/PostList',
                  type: 'directory',
                  layer: 'features',
                  children: [
                    {
                      name: 'PostList.tsx',
                      path: 'src/features/post/post-list/ui/PostList/PostList.tsx',
                      type: 'file',
                      layer: 'features',
                    },
                  ],
                },
              ],
            },
            {
              name: 'create-post',
              path: 'src/features/post/create-post',
              type: 'directory',
              layer: 'features',
              children: [
                {
                  name: 'CreatePostForm',
                  path: 'src/features/post/create-post/ui/CreatePostForm',
                  type: 'directory',
                  layer: 'features',
                  children: [
                    {
                      name: 'CreatePostForm.tsx',
                      path: 'src/features/post/create-post/ui/CreatePostForm/CreatePostForm.tsx',
                      type: 'file',
                      layer: 'features',
                    },
                    {
                      name: 'CreatePostForm.styles.ts',
                      path: 'src/features/post/create-post/ui/CreatePostForm/CreatePostForm.styles.ts',
                      type: 'file',
                      layer: 'features',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'user',
          path: 'src/features/user',
          type: 'directory',
          layer: 'features',
          children: [
            {
              name: 'user-list',
              path: 'src/features/user/user-list',
              type: 'directory',
              layer: 'features',
              children: [
                {
                  name: 'UserList',
                  path: 'src/features/user/user-list/ui/UserList',
                  type: 'directory',
                  layer: 'features',
                  children: [
                    {
                      name: 'UserList.tsx',
                      path: 'src/features/user/user-list/ui/UserList/UserList.tsx',
                      type: 'file',
                      layer: 'features',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'entities',
      description: '도메인 모델 (Post, User 등)',
      color: '#10b981',
      items: [
        {
          name: 'post',
          path: 'src/entities/post',
          type: 'directory',
          layer: 'entities',
          children: [
            {
              name: 'api',
              path: 'src/entities/post/api',
              type: 'directory',
              layer: 'entities',
              children: [
                {
                  name: 'post.api.ts',
                  path: 'src/entities/post/api/post.api.ts',
                  type: 'file',
                  layer: 'entities',
                },
                {
                  name: 'post.queries.ts',
                  path: 'src/entities/post/api/post.queries.ts',
                  type: 'file',
                  layer: 'entities',
                },
              ],
            },
            {
              name: 'model',
              path: 'src/entities/post/model',
              type: 'directory',
              layer: 'entities',
              children: [
                {
                  name: 'types.ts',
                  path: 'src/entities/post/model/types.ts',
                  type: 'file',
                  layer: 'entities',
                },
              ],
            },
            {
              name: 'ui',
              path: 'src/entities/post/ui',
              type: 'directory',
              layer: 'entities',
              children: [
                {
                  name: 'PostCard',
                  path: 'src/entities/post/ui/PostCard',
                  type: 'directory',
                  layer: 'entities',
                  children: [
                    {
                      name: 'PostCard.tsx',
                      path: 'src/entities/post/ui/PostCard/PostCard.tsx',
                      type: 'file',
                      layer: 'entities',
                    },
                    {
                      name: 'PostCard.styles.ts',
                      path: 'src/entities/post/ui/PostCard/PostCard.styles.ts',
                      type: 'file',
                      layer: 'entities',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'user',
          path: 'src/entities/user',
          type: 'directory',
          layer: 'entities',
          children: [
            {
              name: 'api',
              path: 'src/entities/user/api',
              type: 'directory',
              layer: 'entities',
              children: [
                {
                  name: 'user.api.ts',
                  path: 'src/entities/user/api/user.api.ts',
                  type: 'file',
                  layer: 'entities',
                },
                {
                  name: 'user.queries.ts',
                  path: 'src/entities/user/api/user.queries.ts',
                  type: 'file',
                  layer: 'entities',
                },
              ],
            },
            {
              name: 'model',
              path: 'src/entities/user/model',
              type: 'directory',
              layer: 'entities',
              children: [
                {
                  name: 'types.ts',
                  path: 'src/entities/user/model/types.ts',
                  type: 'file',
                  layer: 'entities',
                },
              ],
            },
            {
              name: 'ui',
              path: 'src/entities/user/ui',
              type: 'directory',
              layer: 'entities',
              children: [
                {
                  name: 'UserCard',
                  path: 'src/entities/user/ui/UserCard',
                  type: 'directory',
                  layer: 'entities',
                  children: [
                    {
                      name: 'UserCard.tsx',
                      path: 'src/entities/user/ui/UserCard/UserCard.tsx',
                      type: 'file',
                      layer: 'entities',
                    },
                    {
                      name: 'UserCard.styles.ts',
                      path: 'src/entities/user/ui/UserCard/UserCard.styles.ts',
                      type: 'file',
                      layer: 'entities',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'shared',
      description: '공통 코드 (UI 컴포넌트, 유틸리티, API 설정)',
      color: '#6b7280',
      items: [
        {
          name: 'ui',
          path: 'src/shared/ui',
          type: 'directory',
          layer: 'shared',
          children: [
            { name: 'Button', path: 'src/shared/ui/Button', type: 'directory', layer: 'shared' },
            { name: 'Input', path: 'src/shared/ui/Input', type: 'directory', layer: 'shared' },
            {
              name: 'LoadingSpinner',
              path: 'src/shared/ui/LoadingSpinner',
              type: 'directory',
              layer: 'shared',
            },
            {
              name: 'AsyncBoundary',
              path: 'src/shared/ui/AsyncBoundary',
              type: 'directory',
              layer: 'shared',
            },
            {
              name: 'ErrorDisplay',
              path: 'src/shared/ui/ErrorDisplay',
              type: 'directory',
              layer: 'shared',
            },
            {
              name: 'BackButton',
              path: 'src/shared/ui/BackButton',
              type: 'directory',
              layer: 'shared',
            },
            {
              name: 'EmptyState',
              path: 'src/shared/ui/EmptyState',
              type: 'directory',
              layer: 'shared',
            },
            {
              name: 'FormGroup',
              path: 'src/shared/ui/FormGroup',
              type: 'directory',
              layer: 'shared',
            },
            { name: 'Grid', path: 'src/shared/ui/Grid', type: 'directory', layer: 'shared' },
            { name: 'Label', path: 'src/shared/ui/Label', type: 'directory', layer: 'shared' },
            { name: 'Section', path: 'src/shared/ui/Section', type: 'directory', layer: 'shared' },
            {
              name: 'Textarea',
              path: 'src/shared/ui/Textarea',
              type: 'directory',
              layer: 'shared',
            },
          ],
        },
        {
          name: 'api',
          path: 'src/shared/api',
          type: 'directory',
          layer: 'shared',
          children: [
            { name: 'client.ts', path: 'src/shared/api/client.ts', type: 'file', layer: 'shared' },
          ],
        },
        {
          name: 'utils',
          path: 'src/shared/utils',
          type: 'directory',
          layer: 'shared',
          children: [
            {
              name: 'date.util.ts',
              path: 'src/shared/utils/date.util.ts',
              type: 'file',
              layer: 'shared',
            },
            {
              name: 'format.util.ts',
              path: 'src/shared/utils/format.util.ts',
              type: 'file',
              layer: 'shared',
            },
            {
              name: 'common.util.ts',
              path: 'src/shared/utils/common.util.ts',
              type: 'file',
              layer: 'shared',
            },
            {
              name: 'fsd-scanner.ts',
              path: 'src/shared/utils/fsd-scanner.ts',
              type: 'file',
              layer: 'shared',
            },
          ],
        },
        {
          name: 'config',
          path: 'src/shared/config',
          type: 'directory',
          layer: 'shared',
          children: [
            {
              name: 'routes.ts',
              path: 'src/shared/config/routes.ts',
              type: 'file',
              layer: 'shared',
            },
            { name: 'api.ts', path: 'src/shared/config/api.ts', type: 'file', layer: 'shared' },
            { name: 'const.ts', path: 'src/shared/config/const.ts', type: 'file', layer: 'shared' },
          ],
        },
        {
          name: 'assets',
          path: 'src/shared/assets',
          type: 'directory',
          layer: 'shared',
          children: [
            { name: 'icons', path: 'src/shared/assets/icons', type: 'directory', layer: 'shared' },
            {
              name: 'images',
              path: 'src/shared/assets/images',
              type: 'directory',
              layer: 'shared',
            },
          ],
        },
      ],
    },
  ];
}
