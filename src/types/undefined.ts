import { Equatable, TypeBase } from "../common.js";
import { applyMixins } from "../util.js";

export class UndefinedType implements TypeBase {
  readonly kind = 'undefined';
  __type!: undefined;
}

export interface UndefinedType extends Equatable<UndefinedType> {}

applyMixins(UndefinedType, [Equatable]);

declare module '../common.js' {
  export interface Types {
    undefined: UndefinedType,
  }
}

export function undefined(): UndefinedType {
  return new UndefinedType();
}
