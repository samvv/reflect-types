import { Equatable, Path, TypeBase, ValidationError } from "../common";
import { applyMixins } from "../util";

export class BooleanType implements TypeBase {
  readonly kind = 'boolean';
  __type!: boolean;
}

export interface BooleanType extends Equatable<BooleanType> {}

applyMixins(BooleanType, [Equatable]);

declare module '../common' {
  export interface Types {
    boolean: BooleanType,
  }
}

export function boolean(): BooleanType { 
  return new BooleanType();
}

export function* validateBoolean(value: any, path: Path, type: BooleanType) {
  if (typeof value !== 'boolean') {
    yield new ValidationError(path, `value must be of type boolean`);
    return;
  }
  if (type.equalTo !== undefined && value !== type.equalTo) {
    yield new ValidationError(path, `value must be exactly equal to ${type.equalTo}`);
  }
  return value;
}
