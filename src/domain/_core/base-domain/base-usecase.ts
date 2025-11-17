export interface Usecase<T, K, CurrentUser = null, Context = null> {
  execute(params: T, currentUser?: CurrentUser, context?: Context): Promise<K>;
}
