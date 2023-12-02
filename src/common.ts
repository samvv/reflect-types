
export interface TypeBase {
  __type: any;
  readonly kind: string;
}

export type ValueOf<T extends TypeBase> = T['__type'];

/**
 * Adds logic to a type so that the type can require all values be exactly equal to a given value.
 */
export class Equatable<Self extends TypeBase> {

  equalTo?: ValueOf<Self>;

  withValue(value: ValueOf<Self>): void {
    this.equalTo = value;
  }
}

/**
 * Adds logic to a type so that its values can be set to a default value when empty.
 */
export class Defaultable<Self extends TypeBase> {

  defaultTo?: ValueOf<Self>;

  withDefault(value: ValueOf<Self>): this {
    this.defaultTo = value;
    return this;
  }

}

export class Sequenced<Self extends TypeBase> {

  minLength?: number;
  equalLength?: number;
  maxLength?: number;

  withLength(count: number): this {
    this.equalLength = count;
    return this;
  }

  withMinLength(count: number): this {
    this.minLength = count;
    return this;
  }

  withMaxLength(count: number): this {
    this.maxLength = count;
    return this;
  }

}

export class Ordered<Self extends TypeBase> {

  min?: ValueOf<Self>;
  max?: ValueOf<Self>;

  withMin(min: ValueOf<Self>): this {
    this.min = min;
    return this;
  }

  withMax(max: ValueOf<Self>): this {
    this.max = max;
    return this;
  }

}

export interface Types { }

type TypeTag = keyof Types

export type Type = Types[keyof Types];

export type Path = Array<string | number>;

export class ValidationError extends Error {

  public constructor(
    public path: Path,
    public rawMessage: string,
    public errors?: ValidationError[],
  ) {
    super(`${path.join('.')}: ${rawMessage}`);
  }

}

export type RecurseFn = (value: any, path: Path, type: Type) => Generator<ValidationError, any>;

export type ValidateFn<T extends Type = Type> = (value: any, path: Path, type: T, recurse: RecurseFn) => Generator<ValidationError, any>;

export type Validators = Record<string, ValidateFn>;

const validators: Record<string, ValidateFn> = Object.create(null);

export function registerValidator<K extends TypeTag>(name: K, callback: ValidateFn<Type & { kind: K }>): void {
  const existing = validators[name];
  if (existing !== undefined) {
    throw new Error(
      existing === callback
        ? `Same validator registered twice.`
        : `There is already a validator registered with the name '${name}'.`
    );
  }
  validators[name] = callback as ValidateFn;
}

export function validate<T extends Type>(value: any, type: T, validators: Validators): Generator<ValidationError, ValueOf<T>> {
  function* visit(value: any, path: Path, type: Type) {
    const validator = validators[type.kind];
    if (validator === undefined) {
      throw new Error(`A validator for type '${type.kind}' is not defined.`);
    }
    return yield* validator(value, path, type, visit);
  }
  return visit(value, [], type);
}

export function isValid(value: any, type: Type, validators: Validators): boolean {
  const iter = validate(value, type, validators);
  return !!iter.next().done;
}
