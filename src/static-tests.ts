
import type { ValueOf, UUID, UUID4 } from "./index.js"
import * as types from "./index.js";

type Equal<T, U> =
  (<G>() => G extends T ? 1 : 2) extends 
  (<G>() => G extends U ? 1 : 2) ? true : false;

type Assignable<T, U> = T extends U ? true : false;

function assertTrue<T extends true>() {}
function assertFalse<T extends false>() {}


// BEGIN TEST INFER BOOLEAN

const boolT = types.boolean();

assertTrue<Equal<ValueOf<typeof boolT>, boolean>>();

// END TEST INFER BOOLEAN


// BEGIN TEST INFER NULL

const nullT = types.null_();

assertTrue<Equal<ValueOf<typeof nullT>, null>>();

// END TEST INFER NULL


// BEGIN TEST INFER STRING

const stringT = types.string();

assertTrue<Equal<ValueOf<typeof stringT>, string>>();

// END TEST INFER STRING


// BEGIN TEST INFER NUMBER

const numberT = types.number();

assertTrue<Equal<ValueOf<typeof numberT>, number>>();

// END TEST INFER NUMBER


// BEGIN TEST INFER OBJECT

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

assertTrue<Equal<ValueOf<typeof fooT>, { bar: { left: number, right: string[] }[], bax: string, bal: Date }>>();

const personT = types.object({
  id: types.uuid4(),
  fullName: types.string(),
  email: types.email(),
  dateOfBirth: types.date(),
});

assertTrue<Equal<ValueOf<typeof personT>, { id: UUID4, fullName: string, email: string, dateOfBirth: Date }>>();

// END TEST INFER OBJECT


// BEGIN TEST INFER TUPLE

const x = types.tuple([
  types.number(),
  types.string(),
]);

assertTrue<Equal<ValueOf<typeof x>, [number, string]>>();

// END TEST INFER TUPLE


// BEGIN TEST CALLABLE

const callableT = types.callable(
  [ types.number(), types.string() ] as const,
  types.boolean(),
);

assertTrue<Equal<ValueOf<typeof callableT>, (_a: number, _b: string) => boolean>>();

// END TEST CALLABLE


// BEGIN TEST UUID

// Valid UUID, version 4
assertTrue<Assignable<'0b1ee088-c12a-42da-9bd0-04f2a6870de8', UUID>>();

// Completely invalid
assertFalse<Assignable<'gibberish', UUID>>();

// Missing last dash
assertFalse<Assignable<'0b1ee088-c12a-42da-9bd004f2a6870de8', UUID>>();

// Missing first dash
assertFalse<Assignable<'0b1ee088c12a-42da-9bd0-04f2a6870de8', UUID>>();

const uuid4T = types.uuid4();

assertTrue<Equal<ValueOf<typeof uuid4T>, UUID4>>();

// END TEST UUID

