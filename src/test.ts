
import * as types from "./types"

const personType = types.object({
  id: types.uuid4(),
  fullName: types.string(),
  email: types.email(),
  dateOfBirth: types.date(),
});

const foo = types.object({
  baa: types.string(),
  bar: types.array(types.object({
    left: types.number(),
    right: types.array(
      types.string(),
    ),
  })),
});

let x!: types.ValueOf<typeof foo>;

