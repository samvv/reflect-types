import { PropertyPath, RecurseFn, Type, ValidationError, registerValidator } from "./common.js";
import { hasOwnProperty, isPlainObject } from "./util.js";

import type { ArrayType } from "./types/array.js";
import type { BooleanType } from "./types/boolean.js";
import type { CoercionType } from "./types/coercion.js";
import type { DateType } from "./types/date.js";
import type { LiteralType } from "./types/literal.js";
import type { NullableType } from "./types/nullable.js";
import { NumberCategory, type NumberType } from "./types/number.js";
import type { ObjectType, OptionalType } from "./types/object.js";
import type { StringType } from "./types/string.js";
import type { TupleType } from "./types/tuple.js";
import type { UnionType } from "./types/union.js";
import type { UnknownType } from "./types/unknown.js";
import type { UUID4Type } from "./types/uuid4.js";

export function* validateArray(value: any, path: PropertyPath, type: ArrayType, recurse: RecurseFn) {
  if (!Array.isArray(value)) {
    yield new ValidationError(path.slice(), `value must be an array`);
    return;
  }
  if (type.minLength !== undefined && value.length < type.minLength) {
    yield new ValidationError(path, `there must be at the very least ${type.minLength} elements in the array`);
  }
  if (type.maxLength !== undefined && value.length > type.maxLength) {
    yield new ValidationError(path, `there may be at most ${type.minLength} elements in the array`);
  }
  if (type.equalLength !== undefined && value.length !== type.equalLength) {
    yield new ValidationError(path, `there must be exactly ${type.equalLength} elements in the array`);
  }
  const out = [];
  for (let i = 0; i < value.length; i++) {
    const result = yield* recurse(value[i], [...path, i], type.elementType as Type);
    out.push(result);
  }
  return out;
}


export function* validateBoolean(value: any, path: PropertyPath, type: BooleanType) {
  if (typeof value !== 'boolean') {
    yield new ValidationError(path, `value must be of type boolean`);
    return;
  }
  if (type.equalTo !== undefined && value !== type.equalTo) {
    yield new ValidationError(path, `value must be exactly equal to ${type.equalTo}`);
  }
  return value;
}


export function validateCoercion(value: any, path: PropertyPath, type: CoercionType, recurse: RecurseFn) {
  return recurse(value, path, type.source as Type);
}

export function* validateDate(value: any, path: PropertyPath, type: DateType) {
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

registerValidator('date', validateDate);

export function* validateLiteral(value: any, path: PropertyPath, type: LiteralType) {
  if (value !== type.value) {
    yield new ValidationError(path, `value must exactly be ${type.value}`);
    return;
  }
  return value;
}


export function* validateNullable(value: any, path: PropertyPath, type: NullableType, recurse: RecurseFn) {
  if (value === null) {
    return null;
  }
  return yield* recurse(value, path, type.type as Type);
}


export function* validateNumber(value: any, path: PropertyPath, type: NumberType) {
  if (typeof value !== 'number') {
    yield new ValidationError(path, `value must be of type number`);
    return;
  }
  if (type.equalTo !== undefined && value !== type.equalTo) {
    yield new ValidationError(path, `value must be exactly equal to ${type.equalTo}`);
  }
  if (type.min !== undefined && value < type.min) {
    yield new ValidationError(path, `value must be greater than or equal to ${type.min}`);
  }
  if (type.max !== undefined && value < type.max) {
    yield new ValidationError(path, `value must be greater than or equal to ${type.max}`);
  }
  if (type.category === NumberCategory.Integer && !Number.isInteger(value)) {
    yield new ValidationError(path, `value must be an integer`);
  }
  return value;
}

export function* validateObject(value: any, path: PropertyPath, type: ObjectType, recurse: RecurseFn) {

  if (!isPlainObject(value)) {
    yield new ValidationError(path, `value must be an object`);
    return;
  }

  const out = {} as Record<string, any>;

  if (type.entries !== undefined) {

    for (const [key, childType] of Object.entries(type.entries)) {

      const childPath = [...path, key];

      if (!hasOwnProperty(value, key)) {
        if (childType.kind !== 'optional') {
          yield new ValidationError(childPath, `property does not exist`);
        }

      } else {

        out[key] = yield* recurse(
          value[key]
          , childPath
          , (childType.kind === 'optional'
            ? (childType as OptionalType).type
            : childType) as Type
        );

      }

    }

  }

  for (const [key, _child] of Object.entries(value)) {
    if (!hasOwnProperty(type.entries, key)) {
      yield new ValidationError([...path, key], `property '${key}' must not exist on value`);
    }
  }

  return out;
}

export function* validateString(value: any, path: PropertyPath, type: StringType) {
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

export function* validateTuple(value: any, path: PropertyPath, type: TupleType, recurse: RecurseFn) {
  if (!Array.isArray(value)) {
    yield new ValidationError(path, `value must be an array`);
    return;
  }
  if (value.length !== type.types.length) {
    yield new ValidationError(path, `value is an array but not of length ${type.types.length}`);
    return;
  }
  const out = [];
  let i = 0;
  for (const elementType of type.types) {
    const element = yield* recurse(value[0], [...path, i], elementType as Type);
    out.push(element)
    i++;
  }
  return out;
}

export function* validateUnion(value: any, path: PropertyPath, type: UnionType, recurse: RecurseFn) {
  const errors = [];
  for (const innerType of type.types) {
    const k = errors.length;
    const iter = recurse(value, path, innerType as Type);
    let result;
    for (;;) {
      const { value, done } = iter.next();
      if (done) {
        result = value;
        break;
      }
      errors.push(value);
    }
    if (errors.length === k) {
      return result;
    }
  }
  yield new ValidationError(path, `no union member matched`, errors);
}

export function* validateUnknown(value: any, path: PropertyPath, type: UnknownType, recurse: RecurseFn) {
  return value;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function* validateUUID4(value: any, path: PropertyPath, type: UUID4Type, recurse: RecurseFn) {
  if (!UUID_REGEX.test(value)) {
    yield new ValidationError(path, `invalid pattern for UUID 4`);
    return;
  }
  return value.toLowerCase();
}


registerValidator('array', validateArray);
registerValidator('boolean', validateBoolean);
registerValidator('literal', validateLiteral);
registerValidator('nullable', validateNullable);
registerValidator('number', validateNumber);
registerValidator('object', validateObject);
registerValidator('string', validateString);
registerValidator('tuple', validateTuple);
registerValidator('union', validateUnion);
registerValidator('unknown', validateUnknown);
registerValidator('uuid4', validateUUID4);
