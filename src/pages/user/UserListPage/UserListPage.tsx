import { Header } from '@/widgets/header';
import { PageLayout } from '@/widgets/page-layout';
import { AsyncBoundary } from '@/shared/ui/AsyncBoundary';
import { UserList } from '@/features/user/user-list';

export function UserListPage() {
  return (
    <>
      <Header />
      <PageLayout title="사용자 목록" description="사용자를 조회하고 관리합니다">
        <AsyncBoundary>
          <UserList />
        </AsyncBoundary>
      </PageLayout>
    </>
  );
}
