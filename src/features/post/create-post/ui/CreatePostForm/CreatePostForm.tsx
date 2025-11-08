import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePostMutation } from '@/entities/post';
import { Button } from '@/shared/ui/Button';
import { FormGroup } from '@/shared/ui/FormGroup';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { Textarea } from '@/shared/ui/Textarea';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { StyledForm } from './CreatePostForm.styles';
import { ROUTES_PATHS, TEXTS } from '@/shared/config';
import { useNavigate } from 'react-router-dom';

const createPostSchema = z.object({
  title: z
    .string()
    .min(1, TEXTS.formValidation.titleRequired)
    .max(100, TEXTS.formValidation.titleMaxLength(100)),
  body: z
    .string()
    .min(1, TEXTS.formValidation.bodyRequired)
    .max(1000, TEXTS.formValidation.bodyMaxLength(1000)),
  userId: z.number().min(1, TEXTS.formValidation.userIdMin),
});

type CreatePostFormData = z.infer<typeof createPostSchema>;

export function CreatePostForm() {
  const { mutateAsync: createPost, isPending } = useCreatePostMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      userId: 1,
    },
  });

  const onSubmit = async (data: CreatePostFormData) => {
    await createPost(data);
    navigate(ROUTES_PATHS.POSTS.LIST);
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)} data-fsd-path="features/post/create-post">
      <FormGroup>
        <Label htmlFor="title">{TEXTS.labels.title}</Label>
        <Input
          id="title"
          type="text"
          placeholder={TEXTS.placeholders.postTitle}
          {...register('title')}
          hasError={!!errors.title}
        />
        {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="body">{TEXTS.labels.body}</Label>
        <Textarea
          id="body"
          placeholder={TEXTS.placeholders.postBody}
          rows={10}
          {...register('body')}
          hasError={!!errors.body}
        />
        {errors.body && <ErrorMessage>{errors.body.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="userId">{TEXTS.labels.userId}</Label>
        <Input
          id="userId"
          type="number"
          placeholder={TEXTS.placeholders.userId}
          {...register('userId', { valueAsNumber: true })}
          hasError={!!errors.userId}
        />
        {errors.userId && <ErrorMessage>{errors.userId.message}</ErrorMessage>}
      </FormGroup>

      <Button
        type="submit"
        disabled={isPending}
        data-fsd-path="features/post/create-post/SubmitButton"
      >
        {isPending ? TEXTS.buttons.createLoading : TEXTS.buttons.create}
      </Button>
    </StyledForm>
  );
}
