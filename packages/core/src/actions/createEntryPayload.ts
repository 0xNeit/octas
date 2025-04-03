import {
  EntryFunctionABI,
  MoveFunctionGenericTypeParam,
  TypeTag,
  parseTypeTag,
} from '@aptos-labs/ts-sdk';
import { Abi, AbiFunction, EntryFunctionName } from '@octas/abi';
import { EntryRequestPayload, EntryPayload } from '../types/client';

export function createEntryPayload<
  T extends Abi,
  TFuncName extends EntryFunctionName<T>,
>(abi: T, payload: EntryRequestPayload<T, TFuncName>): EntryPayload {
  const fnAbi = abi.exposed_functions.filter(
    (f) => f.name === payload.function
  )[0];

  if (fnAbi === undefined)
    throw new Error(`Function ${payload.function} not found in ABI`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typeArguments: string[] = payload.typeArguments as any[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const valArguments: any[] = payload.functionArguments as any[];
  const nonSignerIndex = fnAbi.params.findIndex((param) => param !== '&signer');
  const abiArgs = (fnAbi.params as string[]).slice(
    nonSignerIndex === -1 ? fnAbi.params.length : nonSignerIndex
  );

  // Validations
  if (fnAbi === undefined)
    throw new Error(`Function ${payload.function} not found in ABI`);
  if (abiArgs.length !== valArguments.length)
    throw new Error(
      `Function ${payload.function} expects ${fnAbi.params.length} arguments, but ${payload.functionArguments.length} were provided`
    );
  if (fnAbi.generic_type_params.length !== typeArguments.length)
    throw new Error(
      `Function ${payload.function} expects ${fnAbi.generic_type_params.length} type arguments, but ${payload.typeArguments.length} were provided`
    );

  return {
    typeArguments: payload.typeArguments,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    functionArguments: payload.functionArguments as any,
    function: `${payload.address ?? abi.address}::${abi.name}::${payload.function}`,
    abi: constructEntryAbiObj(fnAbi),
  };
}

function constructEntryAbiObj(abi: AbiFunction): EntryFunctionABI {
  // Non-view functions can't be used
  if (!abi.is_entry) {
    throw new Error(`not an entry function`);
  }

  // Type tag parameters for the function
  const params: TypeTag[] = [];
  for (let i = 0; i < abi.params.length; i += 1) {
    params.push(parseTypeTag(abi.params[i]!, { allowGenerics: true }));
  }

  // The return types of the view function
  const returnTypes: TypeTag[] = [];
  for (let i = 0; i < abi.return.length; i += 1) {
    returnTypes.push(parseTypeTag(abi.return[i]!, { allowGenerics: true }));
  }

  return {
    typeParameters:
      abi.generic_type_params as Array<MoveFunctionGenericTypeParam>,
    parameters: params,
  };
}
