Reflect Types
=============

Reflect types provides a method to generate types that can be checked both at compile time and at runtime. 

Think [Zod][zod], but with the useful feature of being able to analyse and traverse the types.

[zod]: https://www.npmjs.com/package/zod

⚠️ This library is still under development. Things might not work or might not work as advertised. You have been warned!

**Defining an object type and validation some data with it**
```ts
import { validate, types } from "reflect-type"

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

**Inspecting a type in order to inefer whether it is nullable**
```ts
import { Type, types } from "reflect-types"

function isNullable(type: Type): boolean {
    switch (type.kind) {
        case 'Null':
        case 'Nullable':
            return true;
        case 'Optional':
            return isNullable(type.type);
        case 'Object':
        case 'Array':
        case 'String':
        case 'Boolean':
        case 'Number':
            return false;
        default:
            assertNever(type);
    }
}

const type = fetchSomeTypeSomehow();

console.log(isNullable(type) ? `The type is nullable.` : `The type is not nullable.`);
```

## Installation

Just install `reflect-types` using your favorite package manager, e.g.:

```sh
npm install reflect-types
```

## API

## License

This project is licensed under the MIT license. See `LICENSE.txt` for more information.
