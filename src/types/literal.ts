
import { Equatable, Path, Type, TypeBase } from "../common";

export type LiteralValue = boolean | number | string;

export class LiteralType<T extends LiteralValue = LiteralValue> implements TypeBase {

  readonly kind = 'literal';

  __type!: T;

  constructor(
    public value: T
  ) {

  }

}

export interface LiteralType<T> extends Equatable<LiteralType<T>> {}

declare module '../common' {
  export interface Types {
    literal: LiteralType,
  }
}

export function literal<T extends LiteralValue>(value: T) {
  return new LiteralType(value);
}

export function* validateLiteral(value: any, path: Path, type: LiteralType) {
  if (value !== type.value) {
    yield new Error(`value must exactly be ${type.value}`);
    return;
  }
  return value;
}
