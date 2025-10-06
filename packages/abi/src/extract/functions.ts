import { MoveFunctionId } from "@aptos-labs/ts-sdk";
import { Abi } from "../abi";
import { OmitSigner } from "../common";
import { ConvertReturns, ConvertArgs, ConvertGenerics } from "../convert";

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

export type ExtractAbiFunctionNames<
  T extends Abi | undefined,
  IsEntry extends boolean = false,
> = T extends Abi
  ? Extract<
      Function<T>, 
      { is_view: IsEntry extends true ? false : true; is_entry: IsEntry }
    >['name']
  : T extends undefined
    ? MoveFunctionId
    : never;

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