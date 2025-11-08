import { useUserListQuery, UserCard } from '@/entities/user';
import { DeleteUserButton } from '@/features/user/delete-user';
import { Grid } from '@/shared/ui/Grid';

export function UserList() {
  const { data: userList } = useUserListQuery();

  return (
    <Grid>
      {userList?.map((user) => (
        <UserCard key={user.id} user={user}>
          {user.id && <DeleteUserButton userId={user.id} />}
        </UserCard>
      ))}
    </Grid>
  );
}
