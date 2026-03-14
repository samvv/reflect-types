import type { TypeBase, Type, Infer } from "../common.js";

export class CallableType<
  Ps extends ReadonlyArray<TypeBase> = ReadonlyArray<TypeBase>,
  R extends TypeBase = TypeBase
> implements TypeBase {

  readonly kind = 'callable';

  __type!: (...args: { [I in keyof Ps]: Infer<Ps[I]> }) => Infer<R>;

  constructor(
    public paramTypes: Ps,
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

