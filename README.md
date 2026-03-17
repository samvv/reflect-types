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
import { type Infer, types as t, validate } from "reflect-types"

const personT = t.object({
    id: t.uuid4(),
    fullName: t.string(),
    email: t.email(),
    dateOfBirth: t.date(),
});

type Person = Infer<typeof personT>;

const person1: Person = {
    id: '22ba434a-c662-4cc9-8a05-5cf1c7c90fd7',
    fullName: 'James Smith',
    email: 'james.smith@gmail.com',
    dateOfBirth: new Date('8/23/1997'),
}

const [errors, result] = validate(person1, personT);

if (errors.length > 0) {
    for (const error of errors) {
        console.log(error);
    }
} else {
    // No errors, yay! Now, `result` may be stored in the database.
}
```

**Inspect a type in order to infer whether it is nullable**

This is where this library really shines.

```ts
import { type Type } from "reflect-types"

function isNullable(type: Type): boolean {
    switch (type.kind) {
        case 'literal':
            return type.value === null;
        case 'null':
            return true;
        case 'union':
            return (type.types as Type[]).some(isNullable);
        default:
            return false;
    }
}

// @ts-expect-error
function fetchSomeTypeSomehow(): Type {
    // TODO
}

const type = fetchSomeTypeSomehow();

console.log(
  isNullable(type)
    ? `The computed type is nullable.`
    : `The computed type is not nullable.`);
```

## Installation

Just install `reflect-types` using your favorite package manager, e.g.:

```sh
npm install reflect-types
```

## API Reference

Most examples in this section require the following import to be present:

```ts
import { types as t } from "reflect-types";
```

### `Infer<T>`

Infer the value of a certain reflected type.

Use the `typeof` keyword to lift the reflected type to the TypeScript type
level.

**Example:**

```ts
import { type Infer, types as t } from "reflect-types";

const objT = t.object({
    foo: t.number(),
    bar: t.string(),
});

type Obj = Infer<typeof objT>;

const fo = {
    foo: 1,
    bar: "hello",
} satisfies Obj;
```

### Primitive Types

#### `t.undefined()`

Represents the TypeScript `undefined` type.

#### `t.null_()`

Represents the TypeScript `null` type.

Notice the trailing `_` to avoid conflict with JavaScript's built-in `null` keyword.

#### `t.boolean()`

Represents the TypeScript `boolean` type.

#### `t.number()`

Represents the TypeScript `number` type.

#### `t.string()`

Represents the TypeScript `string` type.

#### `t.literal(value)`

Represents a TypeScript literal type.

**Examples:**

```ts
import { type Infer, types as t } from "reflect-types";

const trueT = t.literal(true);
const foobarT = t.literal("foobar");
const theAnswerT = t.literal(42);

const x1: Infer<typeof trueT> = true; // ok
// @ts-expect-error
const x2: Infer<typeof trueT> = false; // type error
const x3: Infer<typeof foobarT> = "foobar"; // ok
// @ts-expect-error
const x4: Infer<typeof foobarT> = "blablabla"; // type error
const x5: Infer<typeof theAnswerT> = 42; // ok
// @ts-expect-error
const x6: Infer<typeof theAnswerT> = 3; // type error
```

#### `t.date()`

Represents a plain `Date` object in JavaScript.

### Container Types

#### `t.array(elementType)`

Represents a TypeScript `Array<T>` where `T` is the inferred type of
`elementType`.

```ts
import { types as t } from "reflect-types";

const numbersT = t.array(t.number());

const personsT = t.array(t.object({
    fullName: t.string(),
    dateOfBirth: t.date(),
    email: t.email(),
}));
```

#### `t.object(objLiteral)`

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

#### `t.optional(inner)`

> [!WARNING]
>
> This constructor must only be used inside `t.object()`.

Marks a field of the object being defined as optional.

`inner` is a reflected type that represents the type of the field.

```ts
import { type Infer, types as t } from "reflect-types";

const productT = t.object({
    title: t.string(),
    description: t.optional(t.string()),
    price: t.string(),
});

type Product = Infer<typeof productT>;

// Notice the 'description' field is omitted
const beans = {
    title: "Can of Beans",
    price: "3.00",
} satisfies Product;
```

### Special Types

#### `t.union(elementTypes)`

Represents a TypeScript union type.

`elementTypes` must be an array of reflected types, like so:

```ts
import { types as t } from "reflect-types";

const stringOrNumberT = t.union([
    t.string(),
    t.number(),
]);
```

### Helper Types

#### `t.nullable(inner)`

Represents a union of the type of `inner` and a null literal type.

```ts
import { types as t } from "reflect-types";

const maybeStringT = t.nullable(t.string());
```

### Functions and Execution

#### `t.callable(params, returns)`

Represents a function signature.

Note that due to a limitation in TypeScript you need to add `as const` to the
parameter type array, like so:

```ts
import { type Infer, types as t } from "reflect-types";

const stringLengthSig = t.callable(
    [ t.string() ] as const,
    t.number()
);

const getLength: Infer<typeof stringLengthSig> = x => x.length;
```

#### `t.void_()`

Represents the TypeScript `void` type.

Notice the trailing `_` to avoid conflict with JavaScript's built-in `void` keyword.

The TypeScript `void` type is similar to `undefined`, but is not aways
unifiable with it. In order to correctly declare and define functions that
return nothing, you may need this type.

#### `t.promise(awaitedType)`

Represents the `Promise<T>` TypeScript type, where `T` is represented by `awaitedType`.

```ts
import { type Infer, types as t } from "reflect-types";

const methodT = t.callable(
    [ t.string() ] as const,
    t.promise(t.void_()),
);
```

### Type API

#### `Type.kind`

A unique ID for the category that the given types defines.

For instance, any `ArrayType` always has its `kind` set to `array`.

This field can be used to automatically cast to the associated type, like so:

```ts
import { type Type } from "reflect-types";

function analyse(ty: Type) {
    if (ty.kind === 'array') {
        // Note that we didn't need to cast to use `.elementType`
        console.log(ty.elementType);
    } else if (ty.kind === 'object') {
        // Note that we didn't need to cast to use `.entries`
        console.log(ty.entries);
    } else {
        // ...
    }
}
```

#### `Type.__type`

This field holds the TypeScript type that is associated with the given
reflection type.

You generally don't access it directly. Instead, you use `Infer<T>` to
calculate the TypeScript type for you.

While it is discouraged to access this field, you need to _define_ this field
when you want to add a reflection type. See _advanced usage_ for more
information.

## Advanced Usage

### Extending the type system

The type system is flexible enough to be extended with user-defined types.

Here is a code snippet that create a new type for RGB-colors.

```ts
import { type TypeBase } from "reflect-types"

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

Next, we create the actual class that will represent these values in
`reflect-types`. Usually these have the suffix `Type`. They implement
`TypeBase`, a minimal interface that every type should adhere to.

The fields `kind` and `__type` indicate the tag and the TypeScript type,
respectively. Next, the `declare module`-directive ensures that when a user
specifies our new type somewhere, it is actually accepted by e.g.
`types.object()`.

Finally, we create a simple constructor for our type, making the class
transparent and avoiding the use of `new`.

## License

This project is licensed under the MIT license. See `LICENSE.txt` for more information.

