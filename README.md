Reflect Types
=============

Reflect types allows you to work with types both at compile time and at runtime. 

Think [Zod][zod], but with the useful feature of being able to analyse and traverse the types, not just use them for validation.

[zod]: https://www.npmjs.com/package/zod

Why would I want to use this?

 - You want to declare and validate some JavaScript objects at the same time
 - You want to do some metaprogramming like in C++
 - You want to extend the system with your own types easily and safely
 - You want your users to specify types of data and be able to inspect what they return

## Examples

**Make generic functions truly generic with type information**
```ts
import { Type } from "reflect-types"

function buildEquality(t: Type): boolean {
    switch (t.kind) {
        case 'string':
            return (a,b) => a === b;
        case 'vec2':
            return (a,b) => a[0] === b[0] && a[1] === b[1];
        // and so on ...
    }
}
```

**Build genneric algorithms using these functions**

```ts
import { Type, ValueOf } from "reflect-types"

function getValue<K extends Type, V>(data: Array<[K,V]>, key: ValueOf<T>, keyType: K): V | undefined {
    const equal = buildEquality(keyType);
    for (const [otherKey, otherValue] of data) {
        if (equal(key, otherKey)) {
            return otherValue;
        }
    }
}

const data = [
    [1, 'one'],
    [5, 'five'],
    [3, 'three'],
    [6, 'six'],
];

const elementType = types.vec2();

assoc(data, 1, elementType); // returns 'one'
```

**Define an object type and validate some data with it**
```ts
import { types } from "reflect-types"
import { validate } from "reflect-type/lib/validators.js"

const personType = types.object({
  id: types.uuid4(),
  fullName: types.string(),
  email: types.email(),
  dateOfBirth: types.date(),
});

const person1 = {
    id: '22ba434a-c662-4cc9-8a05-5cf1c7c90fd7',
    fullName: 'James Smith',
    email: 'james.smith@gmail.com',
    dateOfBirth: new Date('8/23/1997'),
}

const [errors, result] = validate(person1, personType);

if (errors.length > 0) {
    for (const error of errors) {
        console.log(error);
    }
    return;
}

// Yay! Now, `result` may e.g. be stored in the database.
```

**Inspect a type in order to infer whether it is nullable**

```ts
import { Type, types } from "reflect-types"

function isNullable(type: Type): boolean {
    switch (type.kind) {
        case 'literal':
            return type.value === null;
        case 'nullable':
            return true;
        case 'optional':
            return isNullable(type.type);
        case 'object':
        case 'array':
        case 'string':
        case 'boolean':
        case 'number':
            return false;
        default:
            assertNever(type);
    }
}

const type = fetchSomeTypeSomehow();

console.log(
  isNullable(type)
    ? `The type is nullable.`
    : `The type is not nullable.`);
```

## Installation

Just install `reflect-types` using your favorite package manager, e.g.:

```sh
npm install reflect-types
```

## Reference

### Extending the type system

The type system is flexible enough to be extended with user-defined types.

Here is a code snippet that create a new type for RGB-colors.

```ts
import { TypeBase } from "reflect-types"

type RGB = [r: number, g: number, b: number];

export class RGBType implements TypeBase {

    // Give your type an unique name. Names should be lowercase and use dashes
    // when consisting of multiple words.
    readonly kind = 'rgb';

    // This resolves to the actual TypeScript type of value that is held by this type.
    __type!: RGB;

}

declare module "reflect-types" {
    interface Types {
        rgb: RGBType,
    }
}

export function rgb(): RGBType {
    return new RGBType();
}
```

In the code above, we first define a TypeScript type for the values we wish to support, in this case `RGB`.
Next, we create the actual class that will represent these values in `reflect-types`. Usually these have the suffix `Type`.
They implement `TypeBase`, a minimal interface that every type should adhere to.
The fields `kind` and `__type` indicate the tag and the TypeScript type, respectively.
Next, the `declare module`-directive ensures that when a user specifies our new type somewhere, it is actually accepted by e.g. `types.object()`.
Finally, we create a simple constructor for our type, making the class transparent and avoiding the use of `new`.

## License

This project is licensed under the MIT license. See `LICENSE.txt` for more information.

