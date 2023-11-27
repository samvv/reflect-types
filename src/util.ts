
export type Byte = number;

export const EOF = '\uFFFF';

export function assert(test: boolean): asserts test {
  if (!test) {
    throw new Error(`Assertion failed. See the stack trace for more information.`);
  }
}

export function isString(value: any): value is string {
  const type = typeof value;
  return (
    type === 'string' ||
    (type === 'object' &&
      value != null &&
      !Array.isArray(value) &&
      getTag(value) === '[object String]')
  );
}

export function isValidURL(input: string): boolean {
  try {
    new URL(input);
  } catch (e) {
    return false;
  }
  return true;
}

const toString = Object.prototype.toString;

function getTag(value: any): string {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return toString.call(value)
}

export function hasOwnProperty(obj: Record<PropertyKey, any>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function isPlainObject(value: any): value is Record<any, any> {
  if (typeof value !== 'object' || value === null || getTag(value) !== '[object Object]') {
    return false;
  }
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
}

type TypedArray 
  = Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array

export function arraysEqual<T extends TypedArray | any[]>(a: T, b: T): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}

export function assertNever(_value: never): never {
  throw new Error(`Code that should have been unreachable was executed. See the stack trace for more information.`);
}
