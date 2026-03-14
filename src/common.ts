
export interface TypeBase {
  __type: any;
  readonly kind: string;
}

export type Infer<T extends TypeBase> = T['__type'];

/**
 * Adds logic to a type so that the type can require all values be exactly equal to a given value.
 */
export class Equatable<Self extends TypeBase> {

  equalTo?: Infer<Self>;

  withValue(value: Infer<Self>): void {
    this.equalTo = value;
  }
}

/**
 * Adds logic to a type so that its values can be set to a default value when empty.
 */
export class Defaultable<Self extends TypeBase> {

  defaultTo?: Infer<Self>;

  withDefault(value: Infer<Self>): this {
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

  min?: Infer<Self>;
  max?: Infer<Self>;

  withMin(min: Infer<Self>): this {
    this.min = min;
    return this;
  }

  withMax(max: Infer<Self>): this {
    this.max = max;
    return this;
  }

}

export interface Types { }

export type TypeTag = keyof Types

export type Type = Types[keyof Types];

export type PropertyPath = Array<string | number>;
