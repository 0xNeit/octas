import { Account as AptosAccount } from '@aptos-labs/ts-sdk';
import { Address, OneOf } from '@octas/types';

export type ReadonlyAccount<address extends Address = Address> = {
  address: address;
  type: 'readonly';
};

export type LocalAccount<address extends Address = Address> = AptosAccount & {
  address: address;
  type: 'local';
};

export type Account<address extends Address = Address> = OneOf<
  ReadonlyAccount<address> | LocalAccount<address>
>;

export type HDOptions =
  | {
      /** The account index to use in the path (`"m/44'/637'/${accountIndex}'/0/0"`). */
      accountIndex?: number | undefined;
      /** The address index to use in the path (`"m/44'/637'/0'/0/${addressIndex}"`). */
      addressIndex?: number | undefined;
      /** The change index to use in the path (`"m/44'/637'/0'/${changeIndex}/0"`). */
      changeIndex?: number | undefined;
      path?: undefined;
    }
  | {
      accountIndex?: undefined;
      addressIndex?: undefined;
      changeIndex?: undefined;
      /** The HD path. */
      path: `m/44'/637'/${string}`;
    };
