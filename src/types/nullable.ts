
import { TypeBase, Equatable, Defaultable, Type } from "../common"
import { applyMixins } from "../util";

export class NullableType<T extends TypeBase = TypeBase> implements TypeBase {

  readonly kind = 'nullable';

  /** @ignore */ __type!: T['__type'] | null;

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
