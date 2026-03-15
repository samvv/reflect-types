import { Equatable, Sequenced, Type, TypeBase } from "../common.js";
import { applyMixins } from "../util.js";

export class RecordType<K extends TypeBase = TypeBase, V extends TypeBase = TypeBase> implements TypeBase {

  readonly kind = 'record';

  __type!: Record<K['__type'], V['__type']>;

  constructor(
    public keyType: K,
    public valueType: V,
  ) {

  }

}

export interface RecordType<K, V> extends Equatable<RecordType<K, V>>, Sequenced<RecordType<K, V>> {}

applyMixins(RecordType, [Equatable, Sequenced]);

declare module '../common.js' {
  export interface Types {
    record: RecordType,
  }
}

export function record<K extends Type, V extends Type>(keyType: K, valueType: V): RecordType<K, V> {
  return new RecordType(keyType, valueType)
}

