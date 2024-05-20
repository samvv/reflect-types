import { Equatable, Sequenced, Type, TypeBase } from "../common.js";
import { applyMixins } from "../util.js";

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

declare module '../common.js' {
  export interface Types {
    array: ArrayType,
  }
}

export function array<T extends Type>(elementType: T): ArrayType<T> {
  return new ArrayType(elementType)
}

