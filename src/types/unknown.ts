
export class UnknownType {

  readonly kind = 'unknown';

  __type!: unknown;

}

declare module '../common.js' {
  interface Types {
    unknown: UnknownType;
  }
}

export function unknown(): UnknownType {
  return new UnknownType();
}
