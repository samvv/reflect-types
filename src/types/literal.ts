
import { Equatable, TypeBase } from "../common";

export type LiteralValue = boolean | number | string;

export class LiteralType<T extends LiteralValue = LiteralValue> implements TypeBase {

  readonly kind = 'literal';

  /** @ignore */ __type!: T;

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

