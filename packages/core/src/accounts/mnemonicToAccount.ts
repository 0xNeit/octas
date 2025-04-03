import { Account, Ed25519Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';
import { ErrorType } from '@octas/errors';
import { HDOptions } from './types';

export type MnemonicToAccountErrorType = ErrorType;

/**
 * @description Creates an Account from a mnemonic phrase.
 *
 * @returns A HD Account.
 */
export function mnemonicToAccount(
  mnemonics: string,
  options: HDOptions
): Account {
  const path =
    options.path ||
    `m/44'/637'/${options.accountIndex}'/${options.changeIndex}/${options.addressIndex}`;
  const privateKey = Ed25519PrivateKey.fromDerivationPath(path, mnemonics);
  const account = new Ed25519Account({ privateKey });
  return account;
}
