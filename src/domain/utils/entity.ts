export function enumerable(isEnumerable = true) {
  return function (target: NonNullable<unknown>, propertyKey: string): void {
    Object.defineProperty(target, propertyKey, { enumerable: isEnumerable });
  };
}

export function Serializable<ResultClass extends { new (...args: any[]): any }>(
  BaseClass: ResultClass,
): ResultClass {
  return class extends BaseClass {
    public toJSON(): Record<string, unknown> {
      const proto = Object.getPrototypeOf(this);
      const jsonObj = { ...this };
      Object.entries(Object.getOwnPropertyDescriptors(proto))
        .filter(
          ([key, descriptor]) =>
            typeof descriptor?.get === 'function' && key[0] !== '_',
        )
        .map(([key, descriptor]) => {
          try {
            jsonObj[key] = (this as any)[key];
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Error calling getter ${key}`, error);
          }
        });

      return { ...jsonObj, id: (this as any).id || undefined };
    }
  };
}
