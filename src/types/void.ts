import { TypeBase } from "../common.js";

export class VoidType implements TypeBase {
  readonly kind = 'void';
  __type!: void;
}

declare module '../common.js' {
  export interface Types {
    void: VoidType,
  }
}

export function void_(): VoidType {
  return new VoidType();
}
