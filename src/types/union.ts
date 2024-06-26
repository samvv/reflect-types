import { Type, TypeBase } from "../common.js";

export class UnionType<Ts extends TypeBase[] = TypeBase[]> implements TypeBase {

  readonly kind = 'union';

  __type!: Ts[number]['__type'];

  constructor(
    public types: Ts
  ) {

  }

}

declare module '../common.js' {
  interface Types {
    union: UnionType;
  }
}

export function union<Ts extends Type[]>(types: Ts): UnionType<Ts> {
  return new UnionType(types);
}

