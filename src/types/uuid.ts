import { Equatable, TypeBase } from "../common.js";
import { applyMixins } from "../util.js";

// Taken from @types/node
export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export type UUID4 = UUID;

export class UUID4Type implements TypeBase {

  readonly kind = 'uuid4';

  __type!: UUID4;

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

export type UUID7 = UUID;

export class UUID7Type implements TypeBase {

  readonly kind = 'uuid4';

  __type!: UUID7;

}


export interface UUID7Type extends Equatable<UUID7Type> {}

applyMixins(UUID7Type, [Equatable]);

declare module '../common.js' {
  interface Types {
    uuid7: UUID7Type;
  }
}

export function uuid7(): UUID7Type {
  return new UUID7Type();
}

