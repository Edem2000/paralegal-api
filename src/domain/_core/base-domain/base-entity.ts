import { EntityId, Identifier } from 'domain/_core/identifier';
import { enumerable } from 'domain/utils/entity';
import { NoOverlap, RequiredFieldsOnly } from 'domain/utils/type-helpers';
//
// /*
//     1. If getter exists we change context to avoid calling properties though this.model in our custom getters or setters, so in your entity class by calling this.property this.model invoked automatically
//     2. We create basic getter and setter only if there is no both getter and setter
//     3. If, for example in our entity class, there is only our custom getter, it means that property considered as readonly
// */
// export function EntityClass<T extends { new (...args: any[]): object }>(constructor: T): any {
//     return class extends constructor {
//         constructor(...args: any[]) {
//             super(...args);
//             const propertyDescriptors = Object.getOwnPropertyDescriptors(this);
//
//             const self = this as unknown as { model: T };
//
//             Object.keys(self.model).forEach((propertyName) => {
//                 const descriptor = propertyDescriptors[propertyName];
//
//                 //Check if getter exist, do not create getter and change context, to avoid calling property though this.model
//                 if (descriptor && descriptor?.get) {
//                     const originalGetter = descriptor.get;
//                     descriptor.get = function (): unknown {
//                         return originalGetter.call(self.model);
//                     };
//                 }
//
//                 //Check if getter exist, do not create getter and change context, to avoid calling property though this.model
//                 if (descriptor && descriptor?.set) {
//                     const originalSetter = descriptor.set;
//                     descriptor.set = function (value): void {
//                         return originalSetter.call(self.model, value);
//                     };
//                 }
//
//                 const getterOrSetterExists = descriptor?.get || descriptor?.set;
//
//                 //Create only if neither getter nor setter exists
//                 if (!getterOrSetterExists) {
//                     Object.defineProperty(self, propertyName, {
//                         enumerable: true,
//                         configurable: true,
//                         get: function () {
//                             return self.model[propertyName];
//                         },
//                         set: function (value: any) {
//                             self.model[propertyName] = value;
//                         },
//                     });
//                 }
//             });
//         }
//     };
// }
//
// @Serializable
// export class BaseVO<Model, KEY extends keyof Model, VO> {
//     @enumerable()
//     protected vo!: Model[KEY];
//
//     constructor(data?: RequiredFieldsOnly<VO>, vo?: Model[KEY]) {
//         Object.defineProperty(this, 'vo', {
//             enumerable: false,
//             value: vo || data || {},
//         });
//         if (data) {
//             Object.assign(this.vo, data);
//         }
//     }
// }
//
export type POJOEntity<T> = T & { id: string };

export type EntityClass<T, E> = {
  new (data?: NoOverlap<RequiredFieldsOnly<T>>): E;
};

export class BaseEntity<T> {
  //TODO: сделать приватным, оставить комментарии
  @enumerable()
  protected model!: T & { id: Identifier };
  constructor(data?: NoOverlap<RequiredFieldsOnly<T>> | T) {
    Object.defineProperty(this, 'model', { value: data });
  }

  public get id(): Identifier {
    if(!this.model.id) {
      // @ts-ignore
      this.model.id = this.model._id ? new EntityId(this.model._id.toString()): new EntityId();
    }
    return this.model.id;
  }

  public set id(id: Identifier) {
    this.model.id = id;
  }

  //TODO: убрать
  public get doc(): unknown {
    return this.model;
  }

  public toString(): string {
    return global.JSON.stringify(this);
  }
  //TODO: сделать приватным, оставить комментарии
  public toJSON(): POJOEntity<T> {
    const obj: POJOEntity<T> = {} as POJOEntity<T>;

    // Обрабатываем экземплярные свойства
    Reflect.ownKeys(this).forEach((key) => {
      if (typeof key === 'string' && key[0] !== '_' && key !== 'model') {
        try {
          obj[key] = Reflect.get(this, key);
        } catch (error) {
          //eslint-disable-next-line no-console
          console.error(`Error calling getter ${key}`, error);
        }
      }
    });

    // Обрабатываем свойства прототипа
    this.prepareObjectForIteration().forEach(([key, descriptor]) => {
      if (key === 'model') {
        return;
      }

      if (descriptor && key[0] !== '_') {
        try {
          obj[key] = Reflect.get(this, key);
        } catch (error) {
          //eslint-disable-next-line no-console
          console.error(`Error calling getter ${key}`, error);
        }
      }
    });

    return obj;
  }

  public prepareObjectForIteration(): [string, PropertyDescriptor][] {
    let tempinst = this.constructor.prototype;

    const descriptors: { [x: string]: PropertyDescriptor } = {};

    while (tempinst) {
      const currentDescriptors = Object.entries(
        Object.getOwnPropertyDescriptors(tempinst),
      );

      currentDescriptors.forEach(([key, value]) => {
        if (!descriptors[key] && typeof value.get == 'function') {
          descriptors[key] = value;
        }
      });
      tempinst = Object.getPrototypeOf(tempinst);
    }

    return Object.entries(descriptors);
  }
}
