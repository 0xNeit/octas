import { DefaultAbiTable } from "../abi";
import { UnknownStruct } from "../common";
import { MoveObject, MoveOption, MovePrimitive, MovePrimitiveMap, MoveVector } from "../types";
import { ConvertStructFieldOptionType } from "./structs";

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
  TMoveType extends MovePrimitive
    ? MovePrimitiveMap<string>[TMoveType]
    : TMoveType extends MoveVector<infer TInner>
      ? ConvertReturnType<TInner>[]
      : TMoveType extends MoveObject
        ? { inner: `0x${string}` }
        : TMoveType extends MoveOption<infer TInner>
          ? ConvertStructFieldOptionType<DefaultAbiTable, TInner>
          : UnknownStruct<TMoveType>;