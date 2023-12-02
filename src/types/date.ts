import { Equatable, Ordered, Path, TypeBase, ValidationError } from "../common";
import { applyMixins } from "../util";

export class DateType implements TypeBase {

  readonly kind = 'date';

  __type!: Date;

  day?: number;
  month?: number;
  year?: number;

  withDay(day: number): this {
    this.day = day;
    return this;
  }

  withMonth(month: number): this {
    this.month = month;
    return this;
  }

  withYear(year: number): this {
    this.year = year;
    return this;
  }

}

export interface DateType extends Equatable<DateType>, Ordered<DateType> {}

applyMixins(DateType, [Equatable, Ordered]);

declare module '../common' {
  export interface Types {
    date: DateType;
  }
}

export function date(): DateType {
  return new DateType();
}

export function* validateDate(value: any, path: Path, type: DateType) {
  if (!(value instanceof Date)) {
    yield new ValidationError(path, `value must be a Date object`);
    return;
  }
  if (type.equalTo !== undefined && value !== type.equalTo) {
    yield new ValidationError(path, `value must be exactly equal to ${type.equalTo.toLocaleString()}`);
  } else {
    if (type.min !== undefined && value < type.min) {
      yield new ValidationError(path, `value may not be set before ${type.min.toLocaleString()}`);
    } else if (type.max !== undefined && value > type.max) {
      yield new ValidationError(path, `value may not be set after ${type.max.toLocaleString()}`);
    }
  }
  return value;
}

