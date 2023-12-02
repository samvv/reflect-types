import { Equatable, Path, RecurseFn, Sequenced, Type, TypeBase, ValidationError } from "../common";
import { applyMixins } from "../util";

export class ArrayType<T extends TypeBase = TypeBase> implements TypeBase {

  readonly kind = 'array';

  __type!: T['__type'][];

  constructor(
    public elementType: T,
  ) {

  }

}

export interface ArrayType<T> extends Equatable<ArrayType<T>>, Sequenced<ArrayType<T>> {}

applyMixins(ArrayType, [Equatable, Sequenced]);

declare module '../common' {
  export interface Types {
    array: ArrayType,
  }
}

export function array<T extends Type>(elementType: T): ArrayType<T> {
  return new ArrayType(elementType)
}

export function* validateArray(value: any, path: Path, type: ArrayType, recurse: RecurseFn) {
  if (!Array.isArray(value)) {
    yield new ValidationError(path.slice(), `value must be an array`);
    return;
  }
  if (type.minLength !== undefined && value.length < type.minLength) {
    yield new ValidationError(path, `there must be at the very least ${type.minLength} elements in the array`);
  }
  if (type.maxLength !== undefined && value.length > type.maxLength) {
    yield new ValidationError(path, `there may be at most ${type.minLength} elements in the array`);
  }
  if (type.equalLength !== undefined && value.length !== type.equalLength) {
    yield new ValidationError(path, `there must be exactly ${type.equalLength} elements in the array`);
  }
  const out = [];
  for (let i = 0; i < value.length; i++) {
    const result = yield* recurse(value[i], [...path, i], type.elementType as Type);
    out.push(result);
  }
  return out;
}
