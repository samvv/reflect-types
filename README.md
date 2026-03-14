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

## API Reference

This examples in this section require the following import to be present:

```ts
import { types as t } from "refect-types";
```

### `ValueOf<T>`

Infer the value of a certain reflected type.

Use the `typeof` keyword to lift the reflected type to the TypeScript type
level.

**Example:**

```ts
import { ValueOf, types as t } from "reflect-types";

const objT = t.object({
    foo: t.number(),
    bar: t.string(),
});

type Obj = ValueOf<typeof objT>;

const fo = {
    foo: 1,
    bar: "hello",
} satisfies Obj;
```

### `t.undefined()`

Represents the TypeScript `undefined` type.

### `t.null_()`

Represents the TypeScript `null` type.

Notice the trailing `_` to avoid conflict with JavaScript's built-in `null` keyword.

### `t.boolean()`

Represents the TypeScript `boolean` type.

### `t.number()`

Represents the TypeScript `number` type.

### `t.string()`

Represents the TypeScript `string` type.

### `t.literal(value)`

Represents a TypeScript literal type.

**Examples:**

```ts
import { ValueOf, types as t } from "reflect-types";

const x1: ValueOf<typeof t.literal(true)> = true; // ok
const x2: ValueOf<typeof t.literal(true)> = false; // type error
const x3: ValueOf<typeof t.literal("foobar")> = "foobar"; // ok
const x4: ValueOf<typeof t.literal("foobar")> = "blablabla"; // type error
const x5: ValueOf<typeof t.literal(42)> = 42; // ok
const x6: ValueOf<typeof t.literal(42)> = 3; // type error
```

### `t.date()`

> [!WARNING]
>
> This constructor is experimental and might change in the future.

Represents a plain date with year, month, day components.

This is not to be confused with a JavaScript date object.

### `t.nullable(inner)`

Represents a union of the type of `inner` and a null literal type.

```ts
import { types as t } from "reflect-types";

const maybeStringT = t.nullable(t.string());
```

### `t.array(elementType)`

Represents a TypeScript `Array<T>` where `T` is the inferred type of
`elementType`.

```ts
import { types as t } from "reflect-types";

const numbersT = t.array(t.number());

const personsT = t.array(t.object({
    fullName: t.string(),
    dateOfBirth: t.date(),
    email: t.email(),
});
```

### `t.object(objLiteral)`

Represents an object literal at the type level, where the keys and values are
specified in `objLiteral`.

```ts
import { types as t } from "reflect-types";

const loginT = t.object({
    username: t.string(),
    password: t.string(),
    rememberMe: t.boolean(),
});
```

### `t.optional(inner)`

> [!WARNING]
>
> This constructor must only be used inside `t.object()`.

Marks a field of the object being defined as optional.

`inner` is a reflected type that represents the type of the field.

```ts
import { types as t } from "reflect-types";

const productT = t.object({
    title: t.string(),
    description: t.optonal(t.string()),
    price: t.boolean(),
});
```

### `t.union(elementTypes)`

Represents a TypeScript union type.

`elementTypes` must be an array of reflected types, like so:

```ts
import { types as t } from "reflect-types";

const stringOrNumberT = t.union([
    t.string(),
    t.number(),
]);
```

### `t.callable(params, returns)`

Represents a function signature.

Note that due to a limitation in TypeScript you need to add `as const` to the
parameter type array, like so:

```ts
import { types as t } from "reflect-types";

const stringLengthSig = t.callable(
    [ t.string() ] as const,
    t.number()
);

const getLength: ValueOf<typeof stringLengthSig> = x => x.length;
```

## Guides

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

