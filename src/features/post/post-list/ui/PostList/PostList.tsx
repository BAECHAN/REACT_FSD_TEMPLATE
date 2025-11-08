import { usePostListQuery, PostCard } from '@/entities/post';
import { DeletePostButton } from '@/features/post/delete-post';
import { Grid } from '@/shared/ui/Grid';

export function PostList() {
  const { data: postList } = usePostListQuery();

  return (
    <Grid data-fsd-path="features/post/post-list/PostList">
      {postList?.map((post) => (
        <PostCard key={post.id} post={post}>
          {post.id && <DeletePostButton postId={post.id} />}
        </PostCard>
      ))}
    </Grid>
  );
}
