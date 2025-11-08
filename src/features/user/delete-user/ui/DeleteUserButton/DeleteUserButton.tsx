import { useDeleteUserMutation } from '@/entities/user';
import { Button } from '@/shared/ui/Button';
import { TEXTS } from '@/shared/config';

interface DeleteUserButtonProps {
  userId: string | number;
}

export function DeleteUserButton({ userId }: DeleteUserButtonProps) {
  const { mutateAsync: deleteUser, isPending } = useDeleteUserMutation();

  const handleDelete = async () => {
    await deleteUser(String(userId));
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={isPending}
      variant="danger"
      data-fsd-path="features/user/delete-user"
    >
      {isPending ? TEXTS.buttons.deleteLoading : TEXTS.buttons.delete}
    </Button>
  );
}
