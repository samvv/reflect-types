import { Equatable, Type, TypeBase } from "../common.js";
import { applyMixins } from "../util.js";
import { number } from "./number.js";

export class TupleType<Ts extends ReadonlyArray<TypeBase> = TypeBase[]> implements TypeBase {

  readonly kind = 'tuple';

  __type!: { [K in keyof Ts]: Ts[K]['__type'] };

  constructor(
    public types: Ts,
  ) {

  }
}

export interface TupleType<Ts> extends Equatable<TupleType<Ts>> {}

applyMixins(TupleType, [Equatable]);

declare module '../common.js' {
  export interface Types {
    tuple: TupleType,
  }
}

export function tuple<Ts extends ReadonlyArray<Type>>(types: [...Ts]): TupleType<Ts> {
  return new TupleType(types);
}

export function vec2() {
  return tuple([
    number(),
    number(),
  ]);
}

export function vec3() {
  return tuple([
    number(),
    number(),
    number(),
  ]);
}

export function vec4() {
  return tuple([
    number(),
    number(),
    number(),
    number(),
  ]);
}
