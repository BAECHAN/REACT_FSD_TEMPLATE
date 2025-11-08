import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

function mergeHandlers<TData, TError, TVariables, TContext>(
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationOptions<TData, TError, TVariables, TContext> {
  const defaultOnError = (error: unknown) => {
    // 공통 에러 로깅 (필요 시 Sentry 등 연결)
    console.error('[RQ][mutation] error:', error);
  };
  const defaultOnSuccess = (_data: TData) => {
    // 공통 후처리 지점 (예: 토스트)
  };
  return {
    ...options,
    onError: (err, vars, onMutateResult, context) => {
      defaultOnError(err);
      // forward all params
      (options?.onError as any)?.(err, vars, onMutateResult, context);
    },
    onSuccess: (data, vars, onMutateResult, context) => {
      defaultOnSuccess(data);
      (options?.onSuccess as any)?.(data, vars, onMutateResult, context);
    },
  };
}

export function useAppMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(options: UseMutationOptions<TData, TError, TVariables, TContext>) {
  return useMutation(mergeHandlers(options));
}
