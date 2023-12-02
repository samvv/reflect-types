import { Equatable, Path, Sequenced, TypeBase, ValidationError } from "../common";
import { applyMixins } from "../util";

export type Encoding = 'ascii' | 'utf-8' | 'utf-16';

export class StringType implements TypeBase {

  readonly kind = 'string';

  __type!: string;

  encoding?: string;
  regex?: RegExp;

  withRegex(regex: RegExp): this {
    this.regex = regex;
    return this;
  }

  withEncoding(encoding: Encoding): this {
    this.encoding = encoding;
    return this;
  }

}

export interface StringType extends Equatable<StringType>, Sequenced<StringType> {}

applyMixins(StringType, [Equatable, Sequenced]);

declare module '../common' {
  export interface Types {
    string: StringType;
  }
}

export function string(): StringType {
  return new StringType();
}

export function* validateString(value: any, path: Path, type: StringType) {
  if (typeof value !== 'string') {
    yield new ValidationError(path, `value must be of type string`);
    return;
  }
  let errored = false;
  if (type.minLength !== undefined && value.length < type.minLength) {
    errored = true;
    yield new ValidationError(path, `there must be at least ${type.minLength} characters in the string`);
  }
  if (type.maxLength !== undefined && value.length > type.maxLength) {
    errored = true;
    yield new ValidationError(path, `there may be at most ${type.minLength} chararcters in the string`);
  }
  if (type.equalLength !== undefined && value.length !== type.equalLength) {
    errored = true;
    yield new ValidationError(path, `there must be exactly ${type.equalLength} characters in the string`);
  }
  if (!errored) {
    // These checks may only happen when we know it is safe to perform extensive calculations on the string because the string is of a given maximum length.
    if (type.regex !== undefined && !type.regex.test(value)) {
      yield new ValidationError(path, `the given value did not match the regular expression`);
    }
  }
  return value;
}

// Taken from https://stackoverflow.com/a/201378
const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

// Taken from https://stackoverflow.com/a/22648406/1173521
const URL_REGEX = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');

export function email(): StringType {
  return string().withRegex(EMAIL_REGEX);
}

export function url(): StringType {
  return string().withRegex(URL_REGEX).withMaxLength(2083);
}
