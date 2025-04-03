export type Abi = {
  address: string;
  name: string;
  friends: readonly string[];
  exposed_functions: readonly AbiFunction[];
  structs: readonly AbiStruct[];
}

export type AbiFunction = {
  name: string;
  visibility: AbiFunctionVisibility;
  is_entry: boolean;
  is_view: boolean;
  generic_type_params: readonly AbiFunctionGenericTypeParam[];
  params: readonly string[];
  return: readonly string[];
}

export type AbiFunctionGenericTypeParam = {
  constraints: readonly AbiAbility[];
}

export type AbiStruct = {
  name: string;
  is_native: boolean;
  is_event: boolean;
  abilities: readonly AbiAbility[];
  generic_type_params: readonly AbiFunctionGenericTypeParam[];
  fields: readonly AbiStructField[];
}

export type AbiStructField = {
  name: string;
  type: string;
}

/**
 * Specifies the visibility levels for move functions, controlling access permissions.
 */
export enum AbiFunctionVisibility {
  PRIVATE = "private",
  PUBLIC = "public",
  FRIEND = "friend",
}

/**
 * Abilities related to moving items within the system.
 */
export enum AbiAbility {
  STORE = "store",
  DROP = "drop",
  KEY = "key",
  COPY = "copy",
}