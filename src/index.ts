
export { assertNever, applyMixins } from "./util.js"

import { ValidateFn, isValid, validate } from "./common.js";

export * from "./common.js"

import * as types from "./types/index.js"

export { types };

export const coreValidators = {
  array: types.validateArray as ValidateFn,
  boolean: types.validateBoolean as ValidateFn,
  date: types.validateDate as ValidateFn,
  nullable: types.validateNullable as ValidateFn,
  number: types.validateNumber as ValidateFn,
  object: types.validateObject as ValidateFn,
  string: types.validateString as ValidateFn,
  tuple: types.validateTuple as ValidateFn,
  union: types.validateUnion as ValidateFn,
  unknown: types.validateUnknown as ValidateFn,
} as Record<string, ValidateFn>;
