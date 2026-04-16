
import { Equatable, Sequenced, Type, TypeBase } from "../common.js";
import { applyMixins } from "../util.js";

export class PartialType<O extends TypeBase = TypeBase> implements TypeBase {

  readonly kind = 'partial';

  __type!: Partial<O['__type']>;

  constructor(
    public objType: O,
  ) {

  }

}

export interface PartialType<O> extends Equatable<PartialType<O>>, Sequenced<PartialType<O>> {}

applyMixins(PartialType, [Equatable, Sequenced]);

declare module '../common.js' {
  export interface Types {
    partial: PartialType,
  }
}

export function partial<O extends Type>(objType: O): PartialType<O> {
  return new PartialType(objType);
}

