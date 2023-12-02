import { Path, RecurseFn, Type, TypeBase } from "../common";

export class CoercionType<T extends TypeBase = TypeBase, R extends TypeBase = TypeBase> implements TypeBase {

  readonly kind = 'coercion';

  __type!: R['__type'];

  constructor(
    public source: T,
    public target: R,
  ) {

  }

}

declare module '../common' {
  export interface Types {
    coercion: CoercionType;
  }
}

export function coerce<T extends Type, R extends Type>(source: T, target: R): CoercionType<T, R> {
  return new CoercionType(source, target);
}

export function validateCoercion(value: any, path: Path, type: CoercionType, recurse: RecurseFn) {
  return recurse(value, path, type.source as Type);
}
