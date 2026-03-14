import type { TypeBase, Type, ValueOf } from "../common.js";

export class CallableType<
  Ps extends ReadonlyArray<TypeBase> = ReadonlyArray<TypeBase>,
  R extends TypeBase = TypeBase
> implements TypeBase {

  readonly kind = 'callable';

  __type!: (...args: { [I in keyof Ps]: ValueOf<Ps[I]> }) => ValueOf<R>;

  constructor(
    public paramsTypes: Ps,
    public returnType: R,
  ) {

  }

}

declare module '../common.js' {
  export interface Types {
    callable: CallableType,
  }
}

export function callable<
  Ps extends ReadonlyArray<Type>,
  R extends Type
>(paramTypes: Ps, returnType: R) {
  return new CallableType(paramTypes, returnType);
}

