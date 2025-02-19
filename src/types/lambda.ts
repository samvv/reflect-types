import { Type, TypeBase } from "../common.js";

export class LambdaType<Ps extends TypeBase[] = TypeBase[], R extends TypeBase = TypeBase> implements TypeBase {

  __type!: (...args: Ps) => R;

  readonly kind = 'lambda';

  constructor(
    public paramTypes: Ps,
    public returnType: R,
  ) {

  }

}

declare module '../common.js' {
  export interface Types {
    lambda: LambdaType,
  }
}

export function lambda<Ps extends Type[], R extends Type>(ps: Ps, r: R): LambdaType<Ps, R> {
  return new LambdaType(ps, r);
}
