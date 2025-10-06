import { AGGREGATOR_ABI, COIN_ABI, EVENT_ABI, GUID_ABI, TABLE_ABI } from './abis';
import { OPTIONAL_AGGREGATOR_ABI } from './abis/optional_aggregator';

/**
 * Module ABI specification
 */
export type Abi = {
  address: string;
  name: string;
  friends: readonly string[];
  exposed_functions: readonly AbiFunction[];
  structs: readonly AbiStruct[];
};

export type AbiFunction = {
  name: string;
  visibility: 'public' | 'private' | 'friend';
  is_entry: boolean;
  is_view: boolean;
  generic_type_params: readonly AbiFunctionGenericTypeParam[];
  params: readonly string[];
  return: readonly string[];
};

export type AbiFunctionGenericTypeParam = {
  constraints: readonly string[];
};

export type AbiStruct = {
  name: string;
  is_native: boolean;
  is_event: boolean;
  abilities: readonly string[];
  generic_type_params: readonly AbiFunctionGenericTypeParam[];
  fields: readonly AbiStructField[];
};

export type AbiStructField = {
  name: string;
  type: string;
};

export type AbiTable = Abi[];

export type DefaultAbiTable = [
  typeof COIN_ABI,
  typeof EVENT_ABI,
  typeof GUID_ABI,
  typeof TABLE_ABI,
  typeof OPTIONAL_AGGREGATOR_ABI,
  typeof AGGREGATOR_ABI,
];
