
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

  min?: number;
  max?: number;

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

export type Type = Types[keyof Types];
