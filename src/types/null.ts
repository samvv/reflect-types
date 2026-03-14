import { Equatable, TypeBase } from "../common.js";
import { applyMixins } from "../util.js";

export class NullType implements TypeBase {
  readonly kind = 'null';
  __type!: null;
}

export interface NullType extends Equatable<NullType> {}

applyMixins(NullType, [Equatable]);

declare module '../common.js' {
  export interface Types {
    null: NullType,
  }
}

export function null_(): NullType {
  return new NullType();
}
