import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ROUTES_PATHS } from '@/shared/config';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages').then((module) => ({ default: module.HomePage })));
const PostListPage = lazy(() =>
  import('@/pages').then((module) => ({ default: module.PostListPage }))
);
const CreatePostPage = lazy(() =>
  import('@/pages').then((module) => ({ default: module.CreatePostPage }))
);
const UserListPage = lazy(() =>
  import('@/pages').then((module) => ({ default: module.UserListPage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages').then((module) => ({ default: module.NotFoundPage }))
);

/**
 * App Router
 * FSD: app 레이어의 라우팅 설정
 */
export function AppRouter() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <LoadingSpinner />
        </div>
      }
    >
      <Routes>
        {/* Home */}
        <Route path={ROUTES_PATHS.HOME} element={<HomePage />} />

        {/* Post */}
        <Route path={ROUTES_PATHS.POSTS.LIST} element={<PostListPage />} />
        <Route path={ROUTES_PATHS.POSTS.NEW} element={<CreatePostPage />} />

        {/* User */}
        <Route path={ROUTES_PATHS.USERS.LIST} element={<UserListPage />} />

        {/* 404 */}
        <Route path={ROUTES_PATHS.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
