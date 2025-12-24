import { Address } from '@octas/types';
import { Account } from '../accounts/types';

export function parseAccount<accountOrAddress extends Address | Account>(
  account: accountOrAddress
): accountOrAddress extends Address ? Account : accountOrAddress {
  if (typeof account === 'string') {
    return { address: account, type: 'readonly' } as any;
  }

  return account as any;
}
