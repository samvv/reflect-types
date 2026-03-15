import { Equatable, Ordered, TypeBase } from "../common.js";
import { applyMixins } from "../util.js";

export const enum NumberCategory {
  Integer,
  Float,
}

export class NumberType implements TypeBase {

  readonly kind = 'number';

  __type!: number;

  category?: NumberCategory;

  asFloat(): this {
    this.category = NumberCategory.Float;
    return this;
  }

  asInteger(): this {
    this.category = NumberCategory.Integer;
    return this;
  }

}

export interface NumberType extends Equatable<NumberType>, Ordered<NumberType> {}

applyMixins(NumberType, [Equatable, Ordered]);

declare module '../common.js' {
  export interface Types {
    number: NumberType,
  }
}

export function number(): NumberType {
  return new NumberType();
}
