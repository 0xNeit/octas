import {
  EntryFunctionABI,
  EntryFunctionArgumentTypes,
  MoveFunctionId,
  SimpleEntryFunctionArgumentTypes,
  TypeTag,
  ViewFunctionABI,
} from '@aptos-labs/ts-sdk';
import {
  Abi,
  EntryFunctionName,
  ExtractArgsTypeOmitSigner,
  ExtractGenericArgsType,
  ViewFunctionName,
  ExtractArgsType,
} from '@octas/abi';

/**
 * The return payload type of `createEntryPayload`
 */
export type EntryPayload = {
  function: MoveFunctionId;
  typeArguments: Array<string>;
  functionArguments: Array<
    EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes
  >;
  abi?: EntryFunctionABI;
};

/**
 * The input payload type of `createEntryPayload`
 */
export type EntryRequestPayload<
  T extends Abi,
  TFuncName extends EntryFunctionName<T>,
> = {
  address?: `0x${string}`;
  function: TFuncName;
  functionArguments: ExtractArgsTypeOmitSigner<T, TFuncName>;
  typeArguments: ExtractGenericArgsType<T, TFuncName>;
};

/**
 * The input payload type of `createViewPayload`
 */
export type ViewRequestPayload<
  T extends Abi,
  TFuncName extends ViewFunctionName<T>,
> = {
  address?: `0x${string}`;
  function: TFuncName;
  functionArguments: ExtractArgsType<T, TFuncName>;
  typeArguments: ExtractGenericArgsType<T, TFuncName>;
};

/**
 * The return payload type of `createViewPayload`
 */
export type ViewPayload<_TReturn> = {
  function: MoveFunctionId;
  typeArguments?: Array<TypeTag | string>;
  functionArguments?: Array<
    EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes
  >;
  abi?: ViewFunctionABI;
};
