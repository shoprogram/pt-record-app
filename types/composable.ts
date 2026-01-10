export interface UseFetchResult<T> {
  data: Ref<T | null>
  error: Ref<string | null>
  isLoading: Ref<boolean>
}
