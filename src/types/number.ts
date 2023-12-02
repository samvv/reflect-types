import { Equatable, Ordered, Path, TypeBase, ValidationError } from "../common";
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

export function* validateNumber(value: any, path: Path, type: NumberType) {
  if (typeof value !== 'number') {
    yield new ValidationError(path, `value must be of type number`);
    return;
  }
  if (type.equalTo !== undefined && value !== type.equalTo) {
    yield new ValidationError(path, `value must be exactly equal to ${type.equalTo}`);
  }
  if (type.min !== undefined && value < type.min) {
    yield new ValidationError(path, `value must be greater than or equal to ${type.min}`);
  }
  if (type.max !== undefined && value < type.max) {
    yield new ValidationError(path, `value must be greater than or equal to ${type.max}`);
  }
  if (type.category === NumberCategory.Integer && !Number.isInteger(value)) {
    yield new ValidationError(path, `value must be an integer`);
  }
  return value;
}
