import { Equatable, Path, TypeBase, ValidationError } from "../common.js";
import { applyMixins } from "../util.js";

export class BooleanType implements TypeBase {
  readonly kind = 'boolean';
  __type!: boolean;
}

export interface BooleanType extends Equatable<BooleanType> {}

applyMixins(BooleanType, [Equatable]);

declare module '../common.js' {
  export interface Types {
    boolean: BooleanType,
  }
}

export function boolean(): BooleanType { 
  return new BooleanType();
}
