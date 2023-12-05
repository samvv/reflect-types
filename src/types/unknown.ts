
export class UnknownType {

  readonly kind = 'unknown';

  __type!: unknown;

}

declare module '../common' {
  interface Types {
    unknown: UnknownType;
  }
}

export function* validateUnknown(value: any) {
  return value;
}

export function unknown(): UnknownType {
  return new UnknownType();
}
