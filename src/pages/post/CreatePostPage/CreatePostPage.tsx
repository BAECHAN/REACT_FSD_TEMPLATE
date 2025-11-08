import { Header } from '@/widgets/header';
import { PageLayout } from '@/widgets/page-layout';
import { CreatePostForm } from '@/features/post/create-post';

export function CreatePostPage() {
  return (
    <>
      <Header />
      <PageLayout title="게시글 작성" description="새 게시글을 작성합니다">
        <CreatePostForm />
      </PageLayout>
    </>
  );
}
