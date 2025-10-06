import { Abi, AbiTable } from "../abi";
import { ConvertStructFieldType, ConvertGenerics } from "../convert";

/**
 * Internal
 */
export type Struct<T extends Abi> = T['structs'][number];

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

type ExtractStructMoveGenericArgsType<
  T extends Abi,
  TStructName extends ResourceStructName<T>,
> = ExtractStruct<T, TStructName>['generic_type_params'];

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