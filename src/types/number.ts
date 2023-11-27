import { Equatable, Ordered, TypeBase } from "../common";
import { applyMixins } from "../util";

export const enum NumberCategory {
  Integer,
  Float,
}

export class NumberType implements TypeBase {

  readonly kind = 'number';

  __type!: number;

  category?: NumberCategory;

  asFloat(): void {
    this.category = NumberCategory.Float;
  }

  asInteger(): void {
    this.category = NumberCategory.Integer;
  }

}

export interface NumberType extends Equatable<NumberType>, Ordered<NumberType> {}

applyMixins(NumberType, [Equatable, Ordered]);

declare module '../common' {
  export interface Types {
    number: NumberType,
  }
}

export function number(): NumberType {
  return new NumberType();
}
