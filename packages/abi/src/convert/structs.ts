import { AbiTable } from "../abi";
import { UnknownStruct, OmitInner } from "../common";
import { MoveNonStructTypes, MoveObject, MovePrimitive, MovePrimitiveMap, MoveVector } from "../types";
import { ResourceStructName, ExtractStructType } from "../extract";

// Convert a struct field Move type to a TypeScript type
export type ConvertStructFieldType<
  TAbiTable extends AbiTable,
  TMoveType extends string,
> = TMoveType extends MoveNonStructTypes
  ? // it's a non-struct type
    ConvertStructFieldNonStructType<TAbiTable, TMoveType>
  : // it's a struct type
    ConvertStructFieldStructType<TAbiTable, TMoveType>;

// Convert a struct field non-struct Move type to a TypeScript type
type ConvertStructFieldNonStructType<
  TAbiTable extends AbiTable,
  TMoveType extends MoveNonStructTypes,
> = TMoveType extends MovePrimitive
  ? MovePrimitiveMap<string>[TMoveType]
  : TMoveType extends MoveVector<infer TInner> // Custom Vector type
    ? ConvertStructFieldType<TAbiTable, TInner>[]
    : TMoveType extends MoveObject
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