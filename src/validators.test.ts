import test from "ava";

import { validate, isValid, type Infer, types } from "./index.js"

test('correctly validates a boolean type', t => {
  const scheme = types.boolean();
  t.true(isValid(false, scheme));
  t.true(isValid(true, scheme));
  t.false(isValid(12, scheme));
  t.false(isValid('foo', scheme));
  t.false(isValid([ 1, 2, 3 ], scheme));
});

test('correctly validates a string type', t => {
  const scheme = types.string();
  t.true(isValid("foobar", scheme));
  t.true(isValid("true", scheme));
  t.true(isValid("false", scheme));
  t.true(isValid("", scheme));
  t.true(isValid("1234", scheme));
  t.true(isValid("an incredibly long string with 1 number", scheme));
  t.false(isValid(12, scheme));
  t.false(isValid(true, scheme));
  t.false(isValid(false, scheme));
  t.false(isValid([ 1, 2, 3 ], scheme));
});

test('correctly validates a number type', t => {
  const scheme = types.number();
  t.true(isValid(1, scheme));
  t.true(isValid(2, scheme));
  t.true(isValid(3, scheme));
  t.true(isValid(42, scheme));
  t.true(isValid(123456, scheme));
  t.true(isValid(0.1, scheme));
  t.true(isValid(0.12345, scheme));
  t.true(isValid(98776.54321, scheme));
  t.true(isValid(-1, scheme));
  t.true(isValid(-27, scheme));
  t.false(isValid("foo", scheme));
  t.false(isValid("", scheme));
  t.false(isValid("1", scheme));
  t.false(isValid("2", scheme));
  t.false(isValid("12345", scheme));
  t.false(isValid(false, scheme));
  t.false(isValid(true, scheme));
  t.false(isValid([ 1, 2, 3 ], scheme));
});

test('can only accept integral numbers', t => {
  const scheme = types.number().asInteger();
  t.true(isValid(1, scheme));
  t.true(isValid(2, scheme));
  t.true(isValid(3, scheme));
  t.true(isValid(42, scheme));
  t.true(isValid(123456, scheme));
  t.true(isValid(-1, scheme));
  t.true(isValid(-27, scheme));
  t.false(isValid(0.1, scheme));
  t.false(isValid(0.12345, scheme));
  t.false(isValid(98776.54321, scheme));
  t.false(isValid("foo", scheme));
  t.false(isValid("", scheme));
  t.false(isValid("1", scheme));
  t.false(isValid("2", scheme));
  t.false(isValid("12345", scheme));
  t.false(isValid(false, scheme));
  t.false(isValid(true, scheme));
  t.false(isValid([ 1, 2, 3 ], scheme));
});

test('validate works on some nested structure', t => {

  const fooT = types.object({
    bax: types.string(),
    bar: types.array(types.object({
      left: types.number(),
      right: types.array(
        types.string(),
      ),
    })),
    bal: types.date(),
  });

  let valid: Infer<typeof fooT> = {
    bax: 'foo',
    bar: [
      {
        left: 42,
        right: [ 'a', 'b', 'c' ]
      }
    ],
    bal: new Date()
  }

  const [ errors1, result1 ] = validate(valid, fooT);
  t.assert(errors1.length === 0);
  t.deepEqual(result1, valid);

  let invalid: Infer<typeof fooT> = {
    bax: 'foo',
    bar: [
      {
        // @ts-expect-error
        left: 'true',
        right: [ 'a', 'b', 'c' ]
      }
    ],
    bal: new Date(),
  }

  const [ errors, _result ] = validate(invalid, fooT);
  t.assert(errors.length === 1);
  t.deepEqual(errors[0].path, [ 'bar', 0, 'left' ]);

});
