import { Abi, AbiTable, DefaultAbiTable } from './abi';
import { UnknownStruct, AnyNumber, OmitInner, OmitSigner } from './common';
import { MoveNonStructTypes, MovePrimitive } from './types';

/**
 * Convert an array of generic arguments from Move type to TypeScript type.
 */
export type ConvertGenerics<T extends readonly any[]> = T extends readonly [
  any,
  ...infer TRest,
]
  ? [string, ...ConvertGenerics<TRest>]
  : [];

/**
 * Convert an array of input arguments type.
 */
export type ConvertArgs<T extends readonly string[]> = T extends readonly [
  infer TArg extends string,
  ...infer TRest extends string[],
]
  ? [ConvertArgType<TArg>, ...ConvertArgs<TRest>]
  : [];

/**
 * Internal
 */
type ConvertArgType<TMoveType extends string> =
  TMoveType extends MoveNonStructTypes
    ? // it's a non-struct type
      ConvertNonStructArgType<TMoveType>
    : // it's a struct type
      UnknownStruct<TMoveType>;

type ConvertPrimitiveArgType<TMoveType extends MovePrimitive> =
  TMoveType extends 'bool'
    ? boolean
    : TMoveType extends 'u8'
      ? number
      : TMoveType extends 'u16'
        ? number
        : TMoveType extends 'u32'
          ? number
          : TMoveType extends 'u64'
            ? AnyNumber
            : TMoveType extends 'u128'
              ? AnyNumber
              : TMoveType extends 'u256'
                ? AnyNumber
                : TMoveType extends 'address'
                  ? `0x${string}`
                  : TMoveType extends '0x1::string::String'
                    ? string
                    : never;

type ConvertNonStructArgType<TMoveType extends MoveNonStructTypes> =
  TMoveType extends MovePrimitive
    ? ConvertPrimitiveArgType<TMoveType>
    : TMoveType extends `vector<u8>`
      ? string | number[] | Uint8Array
      : TMoveType extends `vector<${infer TInner}>`
        ? ConvertArgType<TInner>[]
        : TMoveType extends `0x1::object::Object<${string}>`
          ? `0x${string}`
          : TMoveType extends `0x1::option::Option<${infer TInner}>`
            ? ConvertArgType<TInner> | undefined
            : UnknownStruct<TMoveType>;

/**
 * Checks if type is {@link Abi}.
 *
 * @param abi - {@link Abi} to check
 * @returns Boolean for whether {@link abi} is {@link Abi}
 */
export type IsAbi<abi> = abi extends Abi ? true : false;

/**
 * Convert an array of return types.
 */
export type ConvertReturns<T extends readonly string[]> = T extends readonly [
  infer TArg extends string,
  ...infer TRest extends string[],
]
  ? [ConvertReturnType<TArg>, ...ConvertReturns<TRest>]
  : [];

/**
 * Internal
 */
type ConvertReturnType<TMoveType extends string> =
  TMoveType extends MoveNonStructTypes
    ? // it's a non-struct type
      ConvertNonStructReturnType<TMoveType>
    : // it's a struct type
      UnknownStruct<TMoveType>;

type ConvertPrimitiveReturnType<TMoveType extends MovePrimitive> =
  TMoveType extends 'bool'
    ? boolean
    : TMoveType extends 'u8'
      ? number
      : TMoveType extends 'u16'
        ? number
        : TMoveType extends 'u32'
          ? number
          : TMoveType extends 'u64'
            ? string
            : TMoveType extends 'u128'
              ? string
              : TMoveType extends 'u256'
                ? string
                : TMoveType extends 'address'
                  ? `0x${string}`
                  : TMoveType extends '0x1::string::String'
                    ? string
                    : never;

type ConvertNonStructReturnType<TMoveType extends MoveNonStructTypes> =
  TMoveType extends MovePrimitive
    ? ConvertPrimitiveReturnType<TMoveType>
    : TMoveType extends `vector<${infer TInner}>`
      ? ConvertReturnType<TInner>[]
      : TMoveType extends `0x1::object::Object<${string}>`
        ? { inner: `0x${string}` }
        : TMoveType extends `0x1::option::Option<${infer TInner}>`
          ? ConvertStructFieldOptionType<DefaultAbiTable, TInner>
          : UnknownStruct<TMoveType>;

// Convert a struct field Move type to a TypeScript type
export type ConvertStructFieldType<
  TAbiTable extends AbiTable,
  TMoveType extends string,
> = TMoveType extends MoveNonStructTypes
  ? // it's a non-struct type
    ConvertStructFieldNonStructType<TAbiTable, TMoveType>
  : // it's a struct type
    ConvertStructFieldStructType<TAbiTable, TMoveType>;

/**
 * Internal
 */
type ConvertPrimitiveStructField<T extends MovePrimitive> = T extends 'bool'
  ? boolean
  : T extends 'u8'
    ? number
    : T extends 'u16'
      ? number
      : T extends 'u32'
        ? number
        : T extends 'u64'
          ? string
          : T extends 'u128'
            ? string
            : T extends 'u256'
              ? string
              : T extends 'address'
                ? `0x${string}`
                : T extends '0x1::string::String'
                  ? string
                  : never;

// Convert a struct field non-struct Move type to a TypeScript type
type ConvertStructFieldNonStructType<
  TAbiTable extends AbiTable,
  TMoveType extends MoveNonStructTypes,
> = TMoveType extends MovePrimitive
  ? ConvertPrimitiveStructField<TMoveType>
  : TMoveType extends `vector<${infer TInner}>`
    ? ConvertStructFieldType<TAbiTable, TInner>[]
    : TMoveType extends `0x1::object::Object<${string}>`
      ? { inner: `0x${string}` }
      : TMoveType extends `0x1::option::Option<${infer TInner}>`
        ? ConvertStructFieldOptionType<TAbiTable, TInner>
        : UnknownStruct<TMoveType>;

export type ConvertStructFieldOptionType<
  TAbiTable extends AbiTable,
  TMoveType extends string,
> = {
  vec: [ConvertStructFieldType<TAbiTable, TMoveType>] | [];
};

// Convert a struct field struct Move type to a TypeScript type
type ConvertStructFieldStructType<
  TAbiTable extends AbiTable,
  TMoveType extends string,
> = TMoveType extends `${infer TAccountAddress}::${infer TModuleName}::${infer TStructName}${
  | ''
  | `<${infer _TInnerType}>`}`
  ? OmitInner<TStructName> extends ResourceStructName<
      Extract<
        TAbiTable[number],
        { address: TAccountAddress; name: TModuleName }
      >
    >
    ? ExtractStructType<
        TAbiTable,
        Extract<
          TAbiTable[number],
          { address: TAccountAddress; name: TModuleName }
        >,
        OmitInner<TStructName>
      >
    : // Unknown struct, use the default struct type
      UnknownStruct<TMoveType>
  : UnknownStruct<TMoveType>;

/**
 * All resource struct names in the ABI.
 */
export type ResourceStructName<TAbi extends Abi> = Struct<TAbi>['name'];

/**
 * Extract a Move Struct type, and convert to TypeScript type.
 */
export type ExtractStructType<
  TAbiTable extends AbiTable,
  TAbi extends Abi,
  TStructName extends ResourceStructName<TAbi>,
> = {
  [TField in ExtractStructFieldsName<
    TAbi,
    TStructName
  >]: ConvertStructFieldType<
    TAbiTable,
    ExtractStructFieldMoveType<TAbi, TStructName, TField>
  >;
};

/**
 * Extract the generics of a Move Struct.
 */
export type ExtractStructGenericArgsType<
  T extends Abi,
  TStructName extends ResourceStructName<T>,
> = ConvertGenerics<ExtractStructMoveGenericArgsType<T, TStructName>>;

/**
 * Internal
 */
type Struct<T extends Abi> = T['structs'][number];

type Event<T extends Abi> = Extract<Struct<T>, { is_event: true }>;

type EventName<T extends Abi> = Event<T>['name'];

type ExtractEvent<T extends Abi, TEventName extends EventName<T>> = Extract<
  Event<T>,
  { name: TEventName }
>;

export type ExtractEventFieldsName<
  T extends Abi,
  TEventName extends EventName<T>,
> = ExtractEvent<T, TEventName>['fields'][number]['name'];

type ExtractStructFieldsName<
  T extends Abi,
  TStructName extends ResourceStructName<T>,
> = ExtractStruct<T, TStructName>['fields'][number]['name'];

type ExtractStruct<
  T extends Abi,
  TResourceName extends ResourceStructName<T>,
> = Extract<Struct<T>, { name: TResourceName }>;

type ExtractStructFieldMoveType<
  T extends Abi,
  TStructName extends ResourceStructName<T>,
  TFieldName extends string,
> = Extract<
  ExtractStruct<T, TStructName>['fields'][number],
  { name: TFieldName }
>['type'];

export type ExtractEventFieldMoveType<
  T extends Abi,
  TEventName extends EventName<T>,
  TFieldName extends string,
> = Extract<
  ExtractEvent<T, TEventName>['fields'][number],
  { name: TFieldName }
>['type'];

type ExtractStructMoveGenericArgsType<
  T extends Abi,
  TStructName extends ResourceStructName<T>,
> = ExtractStruct<T, TStructName>['generic_type_params'];

/**
 * All view function names in the ABI.
 */
export type ViewFunctionName<T extends Abi> = ViewFunction<T>['name'];

/**
 * All entry function names in the ABI.
 */
export type EntryFunctionName<T extends Abi> = EntryFunction<T>['name'];

/**
 * Extract the return type of a function from ABI with function name.
 */
export type ExtractReturnType<
  T extends Abi,
  TFuncName extends FunctionName<T>,
> = ConvertReturns<ExtractMoveReturnType<T, TFuncName>>;

/**
 * Extract the input arguments type of a function from ABI with function name.
 */
export type ExtractArgsType<
  T extends Abi,
  TFuncName extends FunctionName<T>,
> = ConvertArgs<ExtractMoveArgsType<T, TFuncName>>;

/**
 * Extract the input arguments type of a function from ABI with function name, but omit the signer.
 */
export type ExtractArgsTypeOmitSigner<
  T extends Abi,
  TFuncName extends FunctionName<T>,
> = ConvertArgs<OmitSigner<ExtractMoveArgsType<T, TFuncName>>>;

/**
 * Extract the input generic arguments type of a function from ABI with function name.
 */
export type ExtractGenericArgsType<
  T extends Abi,
  TFuncName extends FunctionName<T>,
> = ConvertGenerics<ExtractMoveGenericParamsType<T, TFuncName>>;

/**
 * Internal
 */
type Functions<T extends Abi> = T['exposed_functions'];
type Function<T extends Abi> = Functions<T>[number];
type FunctionName<T extends Abi> = Function<T>['name'];
type ViewFunction<T extends Abi> = Extract<
  Functions<T>[number],
  { is_view: true }
>;
type EntryFunction<T extends Abi> = Extract<
  Functions<T>[number],
  { is_entry: true }
>;

type ExtractFunction<
  T extends Abi,
  TFuncName extends FunctionName<T>,
> = Extract<Function<T>, { name: TFuncName }>;

type ExtractMoveReturnType<
  T extends Abi,
  TFuncName extends FunctionName<T>,
> = ExtractFunction<T, TFuncName>['return'];

type ExtractMoveArgsType<
  T extends Abi,
  TFuncName extends FunctionName<T>,
> = ExtractFunction<T, TFuncName>['params'];

type ExtractMoveGenericParamsType<
  T extends Abi,
  TFuncName extends FunctionName<T>,
> = ExtractFunction<T, TFuncName>['generic_type_params'];
