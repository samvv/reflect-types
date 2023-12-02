
import test from "ava"

import { ValueOf, coreValidators, isValid, types, validate } from "."

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
  t.true(isValid(false, scheme, coreValidators));
  t.true(isValid(true, scheme, coreValidators));
  t.false(isValid(12, scheme, coreValidators));
  t.false(isValid('foo', scheme, coreValidators));
  t.false(isValid([ 1, 2, 3 ], scheme, coreValidators));
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

  const errors = [...validate(x, fooScheme, coreValidators)];

  t.assert(errors.length === 1);
  t.deepEqual(errors[0].path, [ 'bar', 0, 'left' ]);

});
