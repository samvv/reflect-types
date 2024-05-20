
import { Equatable, Path, RecurseFn, Type, TypeBase, ValidationError } from "../common.js";
import { hasOwnProperty, isPlainObject } from "../util.js";

export class OptionalType<T extends TypeBase = TypeBase> implements TypeBase {

  readonly kind = 'optional';

  /** @ignore */ __type: T['__type'] | undefined;

  constructor(
    public type: T
  ) {

  }

}

export function optional<T extends Type>(type: T): OptionalType<T> {
  return new OptionalType(type);
}

export type TypeWithOptional
  = Type
  | OptionalType

type TypeObj = Record<string, TypeWithOptional>;

export class ObjectType<T extends Record<string, TypeBase> = Record<string, TypeBase>> implements TypeBase {

  readonly kind = 'object';

  __type!: { [K in keyof T]: T[K]['__type'] };

  constructor(
    public entries: T,
  ) {

  }

  withEntry<K extends PropertyKey, V extends TypeBase>(key: K, value: V): ObjectType<T & { [Key in K]: V }> {
    const newEntries = Object.assign({}, this.entries) as any;
    newEntries[key] = value;
    return new ObjectType(newEntries);
  }

  withEntries<R extends TypeObj>(obj: R): ObjectType<T & R> {
    return new ObjectType(Object.assign({}, this.entries, obj));
  }

}

export interface ObjectType<T> extends Equatable<ObjectType<T>> {}

declare module '../common.js' {
  export interface Types {
    object: ObjectType,
  }
}

export function object<T extends TypeObj>(obj: T): ObjectType<T> {
  return new ObjectType(obj);
}

