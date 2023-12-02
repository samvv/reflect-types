
export { assertNever, applyMixins } from "./util"

import { ValidateFn } from "./common";
import * as types from "./types"

export { types };

export * from "./common"

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
} as Record<string, ValidateFn>;
