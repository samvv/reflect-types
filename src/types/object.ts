
import { Equatable, Path, RecurseFn, Type, TypeBase, ValidationError } from "../common";
import { hasOwnProperty, isPlainObject } from "../util";

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

declare module '../common' {
  export interface Types {
    object: ObjectType,
  }
}

export function object<T extends TypeObj>(obj: T): ObjectType<T> {
  return new ObjectType(obj);
}

export function* validateObject(value: any, path: Path, type: ObjectType, recurse: RecurseFn) {

  if (!isPlainObject(value)) {
    yield new ValidationError(path, `value must be an object`);
    return;
  }

  const out = {} as Record<string, any>;

  if (type.entries !== undefined) {
    for (const [key, childType] of Object.entries(type.entries)) {
      const childPath = [...path, key];
      if (!hasOwnProperty(value, key)) {
        if (childType.kind !== 'optional') {
          yield new ValidationError(childPath, `property does not exist`);
        }
      } else {
        out[key] = yield* recurse(
          value[key]
          , childPath
          , (childType.kind === 'optional'
            ? (childType as OptionalType).type
            : childType) as Type
        );
      }
    }
  }

  for (const [key, _child] of Object.entries(value)) {
    if (!hasOwnProperty(type.entries, key)) {
      yield new ValidationError([...path, key], `property '${key}' must not exist on value`);
    }
  }

  return out;
}
