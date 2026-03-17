
import { types as t, type Infer, type UUID, type UUID4 } from "./index.js"

type Equal<T, U> =
  (<G>() => G extends T ? 1 : 2) extends 
  (<G>() => G extends U ? 1 : 2) ? true : false;

type Assignable<T, U> = T extends U ? true : false;

type Similar<T, U> = T extends U ? U extends T ? true : false : false;

function assertTrue<T extends true>() {}
function assertFalse<T extends false>() {}


// BEGIN TEST INFER BOOLEAN

const boolT = t.boolean();

assertTrue<Equal<Infer<typeof boolT>, boolean>>();

// END TEST INFER BOOLEAN


// BEGIN TEST INFER NULL

const nullT = t.null_();

assertTrue<Equal<Infer<typeof nullT>, null>>();

// END TEST INFER NULL


// BEGIN TEST INFER STRING

const stringT = t.string();

assertTrue<Equal<Infer<typeof stringT>, string>>();

// END TEST INFER STRING


// BEGIN TEST INFER NUMBER

const numberT = t.number();

assertTrue<Equal<Infer<typeof numberT>, number>>();

// END TEST INFER NUMBER


// BEGIN TEST INFER OBJECT

const fooT = t.object({
  bax: t.string(),
  bar: t.array(t.object({
    left: t.number(),
    right: t.array(
      t.string(),
    ),
  })),
  bal: t.date(),
});

// We use Similar instead of Equal because the inferred type is too complex
assertTrue<Similar<Infer<typeof fooT>, { bar: { left: number, right: string[] }[], bax: string, bal: Date }>>();

const personT = t.object({
  id: t.uuid4(),
  fullName: t.string(),
  email: t.email(),
  dateOfBirth: t.date(),
});

// We use Similar instead of Equal because the inferred type is too complex
assertTrue<Similar<Infer<typeof personT>, { id: UUID4, fullName: string, email: string, dateOfBirth: Date }>>();

// END TEST INFER OBJECT


// BEGIN TEST INFER TUPLE

const x = t.tuple([
  t.number(),
  t.string(),
]);

assertTrue<Equal<Infer<typeof x>, [number, string]>>();

// END TEST INFER TUPLE


// BEGIN TEST INFER CALLABLE

const callableT = t.callable(
  [ t.number(), t.string() ] as const,
  t.boolean(),
);

assertTrue<Equal<Infer<typeof callableT>, (_a: number, _b: string) => boolean>>();

// END TEST INFER CALLABLE


// BEGIN TEST UUID

// Valid UUID, version 4
assertTrue<Assignable<'0b1ee088-c12a-42da-9bd0-04f2a6870de8', UUID>>();

// Completely invalid
assertFalse<Assignable<'gibberish', UUID>>();

// Missing last dash
assertFalse<Assignable<'0b1ee088-c12a-42da-9bd004f2a6870de8', UUID>>();

// Missing first dash
assertFalse<Assignable<'0b1ee088c12a-42da-9bd0-04f2a6870de8', UUID>>();

const uuid4T = t.uuid4();

assertTrue<Equal<Infer<typeof uuid4T>, UUID4>>();

// END TEST UUID


// BEGIN TEST INFER RECORD

const fooOrBarT = t.union([ t.literal('foo'), t.literal('bar') ]);
const recordT = t.record(fooOrBarT, t.boolean());

assertTrue<Equal<Infer<typeof recordT>, Record<'foo' | 'bar', boolean>>>();

// END TEST INFER RECORD


// BEGIN TEST INFER OPTIONAL

const optT = t.object({
  req: t.string(),
  opt: t.optional(t.number()),
});

const optInst1: Infer<typeof optT> = { req: "foo" };
optInst1

const optInst2: Infer<typeof optT> = { req: "foo", opt: 1 };
optInst2

const optInst3: Infer<typeof optT> = { req: "foo", opt: undefined };
optInst3

// We use Similar instead of Equal because the inferred type is too complex
assertTrue<Similar<Infer<typeof optT>, { req: string; opt?: number }>>();

// END TEST INFER OPTIONAL
