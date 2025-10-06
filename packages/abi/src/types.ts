/**
 * Types from Move language
 */
import { AnyNumber } from "./common";

export type MoveNonStructTypes =
  | MovePrimitive
  | MoveVector
  | MoveObject
  | MoveOption;

export type MovePrimitiveMap<HighValue extends AnyNumber | string = string> = {
  bool: boolean;

  address: `0x${string}`;
  '0x1::string::String': string;

  // Number
  u8: number;
  u16: number;
  u32: number;
  u64: HighValue;
  u128: HighValue;
  u256: HighValue;

  'vector<bool>': boolean[];
  'vector<u8>': string | number[] | Uint8Array;
  'vector<u16>': number[];
  'vector<u32>': number[];

  'vector<u64>': HighValue[];
  'vector<u128>': HighValue[];
  'vector<u256>': HighValue[];
  'vector<address>': `0x${string}`[];
  'vector<string>': string[];
  'vector<0x1::string::String>': string[];
};

export type MovePrimitive = keyof MovePrimitiveMap<AnyNumber | string>;

export type MoveVector<I extends string = string> = `vector<${I}>`;

export type MoveObject<I extends string = string> = `0x1::object::Object<${I}>`;

export type MoveOption<I extends string = string> = `0x1::option::Option<${I}>`;
