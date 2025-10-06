import {
  Account,
  AccountAddressInput,
  CommittedTransactionResponse,
} from '@aptos-labs/ts-sdk';
import { Abi, AbiTable } from './abi';
import { ViewFunctionName, ExtractGenericArgsType, ExtractArgsType, ExtractReturnType, EntryFunctionName, ExtractArgsTypeOmitSigner, ResourceStructName, ExtractStructGenericArgsType, ExtractStructType } from './extract';

export type AbiViewClient<T extends Abi> = {
  [TFuncName in ViewFunctionName<T>]: (payload: {
    typeArguments: ExtractGenericArgsType<T, TFuncName>;
    functionArguments: ExtractArgsType<T, TFuncName>;
    ledgerVersion?: string;
  }) => Promise<ExtractReturnType<T, TFuncName>>;
};

export type AbiEntryClient<T extends Abi> = {
  [TFuncName in EntryFunctionName<T>]: (payload: {
    typeArguments: ExtractGenericArgsType<T, TFuncName>;
    functionArguments: ExtractArgsTypeOmitSigner<T, TFuncName>;
    account: Account;
  }) => Promise<CommittedTransactionResponse>;
};

export type AbiSimulateClient<T extends Abi> = {
  [TFuncName in EntryFunctionName<T>]: (payload: {
    typeArguments: ExtractGenericArgsType<T, TFuncName>;
    functionArguments: ExtractArgsTypeOmitSigner<T, TFuncName>;
  }) => Promise<CommittedTransactionResponse>;
};

export type AbiResourceClient<TAbiTable extends AbiTable, T extends Abi> = {
  [TStructName in ResourceStructName<T>]: (payload: {
    typeArguments: ExtractStructGenericArgsType<T, TStructName>;
    account: AccountAddressInput;
    ledgerVersion?: string;
  }) => Promise<ExtractStructType<TAbiTable, T, TStructName>>;
};
