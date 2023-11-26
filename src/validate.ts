import { NumberCategory, Type, ValueOf } from "./types";
import { isPlainObject } from "./util";

class ValidationError extends Error {

  public constructor(
    public path: (string | number)[],
    message: string,
  ) {
    super(`${path.join('.')}: ${message}`);
  }

}

function hasOwnProperty(object: Record<string, any>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(object, key);
}

// type AnyValue = ValueOf<Type>;

// const validators = new Map<string, (value: any) => AnyValue>;

export function validate<T extends Type>(value: any, type: T): [ ValidationError[], ValueOf<T> | undefined ] {

  const errors: ValidationError[] = [];
  const path: Array<string | number> = [];

  const visit = (value: any, type: Type): any | undefined => {

    switch (type.kind) {

      case 'String':
      {
        if (typeof value !== 'string') {
          errors.push(new ValidationError(path.slice(), `value must be of type string`));
          return;
        }
        return value;
      }

      case 'Number':
      {
        if (typeof value !== 'number') {
          errors.push(new ValidationError(path.slice(), `value must be of type number`));
          return;
        }
        if (type.equalTo !== undefined && value !== type.equalTo) {
          errors.push(new ValidationError(path.slice(), `value must be exactly equal to ${type.equalTo}`));
        }
        if (type.min !== undefined && value < type.min) {
          errors.push(new ValidationError(path.slice(), `value must be greater than or equal to ${type.min}`));
        }
        if (type.max !== undefined && value < type.max) {
          errors.push(new ValidationError(path.slice(), `value must be greater than or equal to ${type.max}`));
        }
        if (type.category === NumberCategory.Integer && !Number.isInteger(value)) {
          errors.push(new ValidationError(path.slice(), `value must be an integer`));
        }
        return value;
      }

      case 'Object':
      {
        type
        if (!isPlainObject(value)) {
          errors.push(new ValidationError(path.slice(), `value must be an object`));
          return;
        }
        const out = {} as Record<string, any>;
        if (type.entries !== undefined) {
          for (const [key, childType] of Object.entries(type.entries)) {
            path.push(key);
            if (!hasOwnProperty(value, key)) {
              if (childType.kind !== 'Optional') {
                errors.push(new ValidationError(path.slice(), `property does not exist`));
              }
            } else {
              out[key] = visit(value[key], childType.kind === 'Optional' ? childType.type : childType);
            }
            path.pop();
          }
        }
        for (const [key, child] of Object.entries(value)) {
          // TODO check for dangling properties
        }
        return out;
      }

      case 'Coerce':
      {
        if (type.source.kind === 'Uint8Array' && type.target.kind === 'String') {
          return String.fromCodePoint(...value);
        } else {
          throw new Error(`Unknown coercion`);
        }
      }

      case 'Uint8Array':
      {
        if (!(value instanceof Uint8Array)) {
          errors.push(new ValidationError(path.slice(), `value must be an Uint8Array`));
          return;
        }
        return value;
      }

      case 'Array':
      {
        if (!Array.isArray(value)) {
          errors.push(new ValidationError(path.slice(), `value must be an array`));
          return;
        }
        const out = [];
        for (let i = 0; i < value.length; i++) {
          path.push(i);
          const result = visit(value[i], type.elementType);
          path.pop();
          out.push(result);
        }
        return out;
      }

      case 'Union':
      {
        const k = errors.length;
        for (const innerType of type.types) {
          const out = visit(value, innerType);
          if (errors.length === k) {
            return out;
          }
          errors.splice(k);
        }
        errors.push(new ValidationError(path.slice(), `no union member matched`));
        break;
      }

      default:
        throw new Error(`Unexpected type ${type.kind}`);

    }

  }

  const result = visit(value, type);
  return [errors, result];
}

