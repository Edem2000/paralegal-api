export function mergeDeep<T>(target: T, source: Partial<T>): T {
  for (const key of Object.keys(source)) {
    const value = source[key];
    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      if (!target[key]) {
        target[key] = {} as any;
      }
      mergeDeep(target[key], value);
    } else if (value !== undefined) {
      target[key] = value;
    }
  }
  return target;
}
