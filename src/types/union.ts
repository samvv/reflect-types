import { Path, RecurseFn, Type, TypeBase, ValidationError } from "../common";

export class UnionType<Ts extends TypeBase[] = TypeBase[]> implements TypeBase {

  readonly kind = 'union';

  __type!: Ts[number]['__type'];

  constructor(
    public types: Ts
  ) {

  }

}

declare module '../common' {
  interface Types {
    union: UnionType;
  }
}

export function union<Ts extends Type[]>(types: Ts): UnionType<Ts> {
  return new UnionType(types);
}

export function* validateUnion(value: any, path: Path, type: UnionType, recurse: RecurseFn) {
  const errors = [];
  for (const innerType of type.types) {
    const k = errors.length;
    const iter = recurse(value, path, innerType as Type);
    let result;
    for (;;) {
      const { value, done } = iter.next();
      if (done) {
        result = value;
        break;
      }
      errors.push(value);
    }
    if (errors.length === k) {
      return result;
    }
  }
  yield new ValidationError(path, `no union member matched`, errors);
}

