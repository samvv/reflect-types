import { Equatable, Ordered, TypeBase } from "../common";
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
