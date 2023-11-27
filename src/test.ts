
import { ValueOf, types } from "."

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

const foo = types.object({
  bax: types.string(),
  bar: types.array(types.object({
    left: types.number(),
    right: types.array(
      types.string(),
    ),
  })),
  bal: types.date(),
});

type Foo = ValueOf<typeof foo>;

assert<Foo, { bar: { left: number, right: string[] }[], bax: string, bal: Date }, Foo>();

let x!: ValueOf<typeof foo>;

