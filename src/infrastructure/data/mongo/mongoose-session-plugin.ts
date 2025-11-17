import { ClientSession, Document, Query, Schema } from 'mongoose';
import { AsyncLocalStorage } from 'async_hooks';

// Mongoose used to define this before mongoose 6. For backward's compatibility, we will now just define it ourselves.
export interface HookNextFunction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error?: Error): any;
}
export const sessionStorage = new AsyncLocalStorage<ClientSession>();

export function sessionPlugin(schema: Schema): void {
  function applySession(this: Query<any, any>, next: HookNextFunction): void {
    const session = sessionStorage.getStore();
    if (session) {
      this.session(session);
    }
    next();
  }

  schema.pre<Query<any, any>>(/^find/, applySession);
  schema.pre<Query<any, any>>(/^update/, applySession);
  schema.pre<Query<any, any>>(/^delete/, applySession);
  schema.pre<Query<any, any>>(/^count/, applySession);
  schema.pre<Query<any, any>>(/^aggregate/, function (next) {
    const session = sessionStorage.getStore();
    if (session && this instanceof Query) {
      this.session(session);
    }
    next();
  });

  // For save operations on documents
  schema.pre<Document>('save', function (next) {
    const session = sessionStorage.getStore();
    if (session) {
      this.$session(session);
    }
    next();
  });
}
