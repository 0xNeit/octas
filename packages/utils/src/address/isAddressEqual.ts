import { Address } from '@octas/types';
import { isAddress } from './isAddress';
import { InvalidAddressError } from '@octas/errors';

export type IsAddressEqualReturnType = boolean;

export function isAddressEqual(a: Address, b: Address) {
  if (!isAddress(a, { strict: false }))
    throw new InvalidAddressError({ address: a });
  if (!isAddress(b, { strict: false }))
    throw new InvalidAddressError({ address: b });
  return a.toLowerCase() === b.toLowerCase();
}
