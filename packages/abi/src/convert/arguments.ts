import { AnyNumber, UnknownStruct } from "../common";
import { MoveObject, MoveOption, MovePrimitive, MovePrimitiveMap, MoveVector } from "../types";

/**
 * Convert an array of input arguments type.
 */
export type ConvertArgs<T extends readonly string[]> = T extends readonly [
  infer TArg extends string,
  ...infer TRest extends string[],
]
  ? [ConvertArgType<TArg>, ...ConvertArgs<TRest>]
  : [];

// Internal
type ConvertArgType<TMoveType extends string> = TMoveType extends MovePrimitive
  ? MovePrimitiveMap<AnyNumber>[TMoveType]
  : TMoveType extends MoveObject
    ? `0x${string}`
    : TMoveType extends MoveVector<infer TInner>
      ? ConvertArgType<TInner>[]
      : TMoveType extends MoveOption<infer TInner>
        ? ConvertArgType<TInner> | undefined
        : UnknownStruct<TMoveType>;