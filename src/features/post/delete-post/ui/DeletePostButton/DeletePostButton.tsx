import { useDeletePostMutation } from '@/entities/post';
import { Button } from '@/shared/ui/Button';
import { TEXTS } from '@/shared/config';

interface DeletePostButtonProps {
  postId: string | number;
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const { mutateAsync: deletePost, isPending } = useDeletePostMutation();

  const handleDelete = async () => {
    await deletePost(String(postId));
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={isPending}
      variant="danger"
      data-fsd-path="features/post/delete-post/DeletePostButton"
    >
      {isPending ? TEXTS.buttons.deleteLoading : TEXTS.buttons.delete}
    </Button>
  );
}
