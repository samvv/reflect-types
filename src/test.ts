
import test from "ava"

import { ValueOf, types } from "./index.js"

import { validate, isValid } from "./validators.js"

// type IfEquals<T, U, Y=unknown, N=never> =
//   (<G>() => G extends T ? 1 : 2) extends
//   (<G>() => G extends U ? 1 : 2) ? Y : N;

const assert = <A, B extends A, C extends B>() => {}

// const personType = types.object({
//   id: types.uuid4(),
//   fullName: types.string(),
//   email: types.email(),
//   dateOfBirth: types.date(),
// });

test('correctly detects booleans', t => {
  const scheme = types.boolean();
  t.true(isValid(false, scheme));
  t.true(isValid(true, scheme));
  t.false(isValid(12, scheme));
  t.false(isValid('foo', scheme));
  t.false(isValid([ 1, 2, 3 ], scheme));
});

test('works on some nested structure', t => {

  const fooScheme = types.object({
    bax: types.string(),
    bar: types.array(types.object({
      left: types.number(),
      right: types.array(
        types.string(),
      ),
    })),
    bal: types.date(),
  });

  type Foo = ValueOf<typeof fooScheme>;

  assert<Foo, { bar: { left: number, right: string[] }[], bax: string, bal: Date }, Foo>();

  let x: ValueOf<typeof fooScheme> = {
    bax: 'foo',
    bar: [
      {
        // @ts-expect-error
        left: 'true',
        right: [ 'a', 'b', 'c' ]
      }
    ],
    bal: new Date()
  }

  const [ errors, result ] = validate(x, fooScheme);

  t.assert(errors.length === 1);
  t.deepEqual(errors[0].path, [ 'bar', 0, 'left' ]);

});

test('first example in README works', t => {

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

  t.pass();

});
