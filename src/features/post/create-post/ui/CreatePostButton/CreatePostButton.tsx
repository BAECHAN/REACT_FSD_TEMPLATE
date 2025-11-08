import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { ROUTES_PATHS } from '@/shared/config';

interface CreatePostButtonProps {
  children?: React.ReactNode;
}

export function CreatePostButton({ children = '게시글 작성' }: CreatePostButtonProps) {
  return (
    <Button
      as={Link}
      to={ROUTES_PATHS.POSTS.NEW}
      data-fsd-path="features/post/create-post/CreatePostButton"
    >
      {children}
    </Button>
  );
}
