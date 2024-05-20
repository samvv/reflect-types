
import { Equatable, TypeBase } from "../common.js";

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

declare module '../common.js' {
  export interface Types {
    literal: LiteralType,
  }
}

export function literal<T extends LiteralValue>(value: T) {
  return new LiteralType(value);
}
