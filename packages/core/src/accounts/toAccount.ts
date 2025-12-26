import { Address } from '@octas/types';
import { Account as AptosAccount } from '@aptos-labs/ts-sdk';
import { AccountSource, LocalAccount, ReadonlyAccount } from './types';
import { isAddress } from '@octas/utils';
import { InvalidAddressError } from '@octas/errors';

type GetAccountReturnType<accountSource extends AccountSource> =
  | (accountSource extends Address ? ReadonlyAccount : never)
  | (accountSource extends AptosAccount ? LocalAccount : never);

/**
 * @description Creates an Account from a custom signing implementation.
 *
 * @returns A Local Account.
 */

export function toAccount<accountSource extends AccountSource>(
  source: accountSource
): GetAccountReturnType<accountSource> {
  if (typeof source === 'string') {
    if (!isAddress(source, { strict: false }))
      throw new InvalidAddressError({ address: source });
    return {
      address: source,
      type: 'readonly',
    } as GetAccountReturnType<accountSource>;
  }

  if (!isAddress(source.address, { strict: false })) {
    throw new InvalidAddressError({ address: source.address });
  }

  return {
    address: source.address,
    sign: source.sign,
    signTransaction: source.signTransaction,
    signWithAuthenticator: source.signWithAuthenticator,
    signTransactionWithAuthenticator: source.signTransactionWithAuthenticator,
    source: 'custom',
    type: 'local',
  } as GetAccountReturnType<accountSource>;
}

export function aptosAccountToAccountSource(
  account: AptosAccount
): AccountSource {
  return {
    address: account.accountAddress.toStringLong(),
    sign: account.sign,
    signTransaction: account.signTransaction,
    signWithAuthenticator: account.signWithAuthenticator,
    signTransactionWithAuthenticator: account.signTransactionWithAuthenticator,
  };
}
