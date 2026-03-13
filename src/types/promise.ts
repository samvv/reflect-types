import { Equatable, Type, TypeBase } from "../common.js"
import { applyMixins } from "../util.js";

export class PromiseType<T extends TypeBase = TypeBase> implements TypeBase {

  readonly kind = 'promise';

  __type!: Promise<T['__type']>;

  constructor(
    public awaited: T,
  ) {

  }

}

export interface PromiseType<T> extends Equatable<PromiseType<T>> {}

applyMixins(PromiseType, [Equatable]);

declare module '../common.js' {
  export interface Types {
    promise: PromiseType,
  }
}

export function promise<T extends Type>(elementType: T): PromiseType<T> {
  return new PromiseType(elementType)
}

