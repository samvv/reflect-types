
import { TypeBase, Equatable, Defaultable, Type, Path, RecurseFn } from "../common"
import { applyMixins } from "../util";

export class NullableType<T extends TypeBase = TypeBase> implements TypeBase {

  readonly kind = 'nullable';

  __type!: T['__type'] | null;

  constructor(
    public type: T,
  ) {

  }

}

export interface NullableType<T extends TypeBase> extends Equatable<NullableType<T>>, Defaultable<NullableType<T>> { }

applyMixins(NullableType, [Equatable, Defaultable]);

declare module "../common" {
  export interface Types {
    nullable: NullableType,
  }
}

export function nullable<T extends Type>(type: T): NullableType<T> {
  return new NullableType<T>(type);
}

export function* validateNullable(value: any, path: Path, type: NullableType, recurse: RecurseFn) {
  if (value === null) {
    return null;
  }
  return yield* recurse(value, path, type.type as Type);
}

