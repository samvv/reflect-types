import { Equatable, TypeBase } from "../common";
import { applyMixins } from "../util";

export class BooleanType implements TypeBase {
  readonly kind = 'boolean';
  /** @ignore */ __type!: boolean;
}

export interface BooleanType extends Equatable<BooleanType> {}

applyMixins(BooleanType, [Equatable]);

declare module '../common' {
  export interface Types {
    boolean: BooleanType,
  }
}

export function boolean(): BooleanType { 
  return new BooleanType();
}

