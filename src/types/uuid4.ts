import { Equatable, Path, TypeBase, ValidationError } from "../common";
import { applyMixins } from "../util";

export class UUID4Type implements TypeBase {

  readonly kind = 'uuid4';

  __type!: string;

}

export interface UUID4Type extends Equatable<UUID4Type> {}

applyMixins(UUID4Type, [Equatable]);

declare module '../common' {
  interface Types {
    uuid4: UUID4Type;
  }
}

export function uuid4(): UUID4Type {
  return new UUID4Type();
}


const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function* validateUUID4(value: any, path: Path) {
  if (!UUID_REGEX.test(value)) {
    yield new ValidationError(path, `invalid pattern for UUID4`);
    return;
  }
  return value.toLowerCase();
}
