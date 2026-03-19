import { Equatable, TypeBase } from "../common.js";
import { applyMixins } from "../util.js";

export class AnyType implements TypeBase {
  readonly kind = 'any';
  __type!: any;
}

export interface AnyType extends Equatable<AnyType> {}

applyMixins(AnyType, [Equatable]);

declare module '../common.js' {
  export interface Types {
    any: AnyType,
  }
}

export function any(): AnyType {
  return new AnyType();
}
