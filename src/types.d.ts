
export type ValueOf<T extends Type> = T['__type'];

export type Type
  = BooleanType
  | NumberType
  | StringType
  | Uint8ArrayType
  | Int8ArrayType
  | Uint16ArrayType
  | Int16ArrayType
  | Uint32ArrayType
  | Int32ArrayType
  | NullableType
  | ArrayType
  | ObjectType
  | TupleType
  | CoerceType
  | LiteralType
  | UnionType

export type TypeWithOptional
  = Type
  | OptionalType

interface TypeBase {
  __type: any;
  readonly kind: string;
}

interface Equatable<Self extends TypeBase> {
  equalTo?: ValueOf<Self>;
  withValue(value: ValueOf<Self>): Self;
}

interface Defaultable<Self extends TypeBase> {
  withDefault(value: ValueOf<Self>): Self;
}

interface Ordered<Self extends TypeBase> {
  min?: number;
  max?: number;
  withMin(min: ValueOf<Self>): Self;
  withMax(min: ValueOf<Self>): Self;
}

export interface NullableType<T extends TypeBase = TypeBase> extends TypeBase, Equatable<NullableType<T>>, Defaultable<NullableType<T>> {
  kind: 'Nullable';
  __type: T['__type'] | null;
  readonly type: T;
}

export function nullable<T extends Type>(inner: T): NullableType<T>;

export interface BooleanType extends TypeBase, Equatable<BooleanType>, Defaultable<BooleanType>{
  kind: 'Boolean';
  __type: boolean;
}

export function boolean(): boolean;

export const enum NumberCategory {
  Integer,
  Float,
}

export interface NumberType extends TypeBase, Equatable<NumberType>, Defaultable<NumberType>, Ordered<NumberType> {
  kind: 'Number';
  __type: number;
  category?: NumberCategory;
  asFloat(): NumberType;
  asInteger(): NumberType;
}

export function number(): NumberType;

export type Encoding = 'ascii' | 'utf-8' | 'utf-16';

export interface StringType extends TypeBase, Equatable<StringType>, Defaultable<StringType> {
  kind: 'String';
  __type: string;
  withLength(count: number): StringType;
  withRegex(regex: RegExp): StringType;
  withEncoding(encoding: Encoding): StringType;
  asUrl(): StringType;
}

export function string(): StringType;

export interface ArrayType<T extends TypeBase = TypeBase> extends TypeBase, Equatable<ArrayType>, Defaultable<ArrayType> {
  kind: 'Array';
  __type: T['__type'][];
  elementType: T;
  withMinLength(count: number): ArrayType<T>;
  withMaxLength(count: number): ArrayType<T>;
  withLength(count: number): ArrayType<T>;
}

export function array<T extends Type>(elementType: T): ArrayType<T>;

export interface Uint8ArrayType extends TypeBase, Equatable<Uint8ArrayType>, Defaultable<Uint8ArrayType> {
  kind: 'Uint8Array';
  __type: Uint8Array;
  withLength(count: number): Uint8ArrayType;
}

export function uint8Array(): Uint8ArrayType;

export interface Int8ArrayType extends TypeBase, Equatable<Int8ArrayType>, Defaultable<Int8ArrayType> {
  kind: 'Int8Array';
  __type: Int8Array;
  withLength(count: number): Int8ArrayType;
}

export function int8Array(): Int8ArrayType;

export interface Int16ArrayType extends TypeBase, Equatable<Int16ArrayType>, Defaultable<Int16ArrayType> {
  kind: 'Int16Array';
  __type: Int16Array;
  withLength(count: number): Int16ArrayType;
}

export function int16Array(): Int16ArrayType;

export interface Uint16ArrayType extends TypeBase, Equatable<Uint16ArrayType>, Defaultable<Uint16ArrayType> {
  kind: 'Uint16Array';
  __type: Uint16Array;
  withLength(count: number): Uint16ArrayType;
}

export function uint16Array(): Uint16ArrayType;

export interface Int32ArrayType extends Equatable<Int32ArrayType>, Defaultable<Int32ArrayType> {
  kind: 'Int32Array';
  __type: Int32Array;
  withLength(count: number): Int32ArrayType;
}

export function int32Array(): Int32ArrayType;

export interface Uint32ArrayType extends TypeBase, Equatable<Uint32ArrayType>, Defaultable<Uint32ArrayType> {
  kind: 'Uint32Array';
  __type: Uint32Array;
  withLength(count: number): Uint32ArrayType;
}

export function uint32Array(): Uint32ArrayType;

export interface Float32ArrayType extends TypeBase, Equatable<Float32ArrayType>, Defaultable<Float32ArrayType> {
  kind: 'Float32Array';
  __type: Float32Array;
  withLength(count: number): Float32ArrayType;
}

export function float32Array(): Float32ArrayType;

export interface Float64ArrayType extends TypeBase, Equatable<Float64ArrayType>, Defaultable<Float64ArrayType> {
  kind: 'Float64Array';
  __type: Float64Array;
  withLength(count: number): Float64ArrayType;
}

export function float64Array(): Float64ArrayType;

export interface TupleType<Ts extends TypeBase[] = TypeBase[]> extends TypeBase, Equatable<TupleType<Ts>>, Defaultable<TupleType<Ts>> {
  kind: 'Tuple';
  __type: { [K in keyof Ts]: Ts[K]['__type'] };
  types: Ts;
}

export function tuple<Ts extends Type[]>(types: Ts): TupleType<Ts>;

export type LiteralValue = boolean | number | string;

export interface LiteralType<T extends LiteralValue = LiteralValue> extends TypeBase, Equatable<LiteralType<T>>, Defaultable<LiteralType<T>> {
  kind: 'Literal';
  __type: T;
  value: T;
}

type TypeObj = Record<string, TypeWithOptional>;

export interface ObjectType<T extends Record<string, TypeBase> = TypeObj> extends TypeBase, Equatable<ObjectType<T>>, Defaultable<ObjectType<T>> {
  kind: 'Object';
  __type: { [K in keyof T]: T[K]['__type'] };
  entries: T;
  withEntry<K extends PropertyKey, V>(key: K, value: V): ObjectType<T & { [Key in K]: V }>;
  withEntries<R extends TypeObj>(obj: R): ObjectType<T & R>;
}

export function object<T extends TypeObj>(obj: T): ObjectType<T>;

export interface OptionalType<T extends TypeBase = TypeBase> extends TypeBase {
  kind: 'Optional';
  __type: T['__type'] | undefined;
  type: T;
}

export function optional<T extends Type>(type: T): OptionalType<T>;

export interface CoerceType<T extends TypeBase = TypeBase, R extends TypeBase = TypeBase> extends TypeBase {
  kind: 'Coerce';
  __type: R['__type'];
  source: T;
  target: R;
}

export function coerce<T extends Type, R extends Type>(source: T, target: R): CoerceType<T, R>;

export interface UnionType<Ts extends TypeBase[] = TypeBase[]> extends TypeBase {
  kind: 'Union';
  __type: Ts[number]['__type'];
  types: Ts;
}

export function union<Ts extends Type[]>(types: Ts): UnionType<Ts>;

