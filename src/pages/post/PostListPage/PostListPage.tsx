import { Header } from '@/widgets/header';
import { PageLayout } from '@/widgets/page-layout';
import { AsyncBoundary } from '@/shared/ui/AsyncBoundary';
import { PostList } from '@/features/post/post-list';
import { CreatePostButton } from '@/features/post/create-post';
import { StyledActions } from './PostListPage.styles';

export function PostListPage() {
  return (
    <>
      <Header />
      <PageLayout title="게시글 목록" description="게시글을 조회하고 관리합니다">
        <AsyncBoundary>
          <StyledActions>
            <CreatePostButton />
          </StyledActions>
          <PostList />
        </AsyncBoundary>
      </PageLayout>
    </>
  );
}
