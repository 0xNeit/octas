import { AccountAddress } from '@aptos-labs/ts-sdk';
import { Address } from '@octas/types';

export type IsAddressOptions = {
  /**
   * Enables strict mode. Whether or not to compare the address against its checksum.
   *
   * @default true
   */
  strict?: boolean | undefined;
};

export function isAddress(
  address: string,
  options?: IsAddressOptions
): address is Address {
  const isValid = AccountAddress.isValid({ input: address, ...options }).valid;
  if (isValid) {
    return true;
  } else {
    return false;
  }
}
