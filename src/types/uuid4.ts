import { Equatable, TypeBase } from "../common.js";
import { applyMixins } from "../util.js";

export class UUID4Type implements TypeBase {

  readonly kind = 'uuid4';

  __type!: string;

}

export interface UUID4Type extends Equatable<UUID4Type> {}

applyMixins(UUID4Type, [Equatable]);

declare module '../common.js' {
  interface Types {
    uuid4: UUID4Type;
  }
}

export function uuid4(): UUID4Type {
  return new UUID4Type();
}

