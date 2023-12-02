import { Equatable, Path, RecurseFn, Type, TypeBase, ValidationError } from "../common";
import { applyMixins } from "../util";

export class TupleType<Ts extends TypeBase[] = TypeBase[]> implements TypeBase {

  readonly kind = 'tuple';

  __type!: { [K in keyof Ts]: Ts[K]['__type'] };

  constructor(
    public types: Ts,
  ) {

  }
}

export interface TupleType<Ts> extends Equatable<TupleType<Ts>> {}

applyMixins(TupleType, [Equatable]);

declare module '../common' {
  export interface Types {
    tuple: TupleType,
  }
}

export function tuple<Ts extends Type[]>(types: Ts): TupleType<Ts> {
  return new TupleType(types);
}

export function* validateTuple(value: any, path: Path, type: TupleType, recurse: RecurseFn) {
  if (!Array.isArray(value)) {
    yield new ValidationError(path, `value must be an array`);
    return;
  }
  if (value.length !== type.types.length) {
    yield new ValidationError(path, `value is not an array of length ${type.types.length}`);
    return;
  }
  const out = [];
  let i = 0;
  for (const elementType of type.types) {
    const element = yield* recurse(value[0], [...path, i], elementType as Type);
    out.push(element)
    i++;
  }
  return out;
}
